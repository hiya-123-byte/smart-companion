from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sqlite3
import os
import json
from datetime import datetime

from groq import Groq
from fastapi.middleware.cors import CORSMiddleware


# ======================
# APP INIT
# ======================
app = FastAPI(title="Smart Companion Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================
# ENV + LLM CLIENT
# ======================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not found")

client = Groq(api_key=GROQ_API_KEY)

# ======================
# DATABASE
# ======================
conn = sqlite3.connect("users.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    avatar TEXT NOT NULL,
    needs_more_steps INTEGER,
    simple_language INTEGER
)
""")

# 🆕 TASK HISTORY TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    task TEXT,
    steps TEXT,
    created_at TEXT
)
""")

conn.commit()

# ======================
# MODELS
# ======================
class RegisterRequest(BaseModel):
    email: str
    username: str
    avatar: str
    needs_more_steps: bool = True
    simple_language: bool = True


class TaskRequest(BaseModel):
    email: str
    task: str


# ======================
# LLM ABSTRACTION (SAFE)
# ======================
def generate_llm_steps(prompt: str) -> dict:
    completion = client.chat.completions.create(
        model="groq/compound-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a calm productivity assistant for people with low focus. "
                    "Break tasks into very small, gentle steps. "
                    "Return STRICT JSON only."
                )
            },
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    content = completion.choices[0].message.content

    try:
        return json.loads(content)
    except Exception:
        return {
            "error": "LLM returned invalid JSON",
            "raw_output": content
        }

# ======================
# REGISTER USER
# ======================
@app.post("/register")
def register_user(data: RegisterRequest):
    cursor.execute("SELECT email FROM users WHERE email = ?", (data.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    cursor.execute(
        """
        INSERT INTO users (email, username, avatar, needs_more_steps, simple_language)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            data.email,
            data.username,
            data.avatar,
            int(data.needs_more_steps),
            int(data.simple_language)
        )
    )
    conn.commit()
    return {"status": "registered"}

# ======================
# GET USER
# ======================
@app.get("/user")
def get_user(email: str):
    cursor.execute(
        "SELECT email, username, avatar, needs_more_steps, simple_language FROM users WHERE email = ?",
        (email,)
    )
    row = cursor.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "email": row[0],
        "username": row[1],
        "avatar": row[2],
        "needs_more_steps": bool(row[3]),
        "simple_language": bool(row[4])
    }

# ======================
# TASK DECOMPOSITION
# ======================
@app.post("/decompose-task")
def decompose_task(req: TaskRequest):
    cursor.execute(
        "SELECT needs_more_steps, simple_language FROM users WHERE email = ?",
        (req.email,)
    )
    profile = cursor.fetchone()

    if not profile:
        raise HTTPException(status_code=404, detail="User not registered")

    needs_more_steps, simple_language = profile

    prompt = f"""
Task: {req.task}

Preferences:
- Very small steps: {bool(needs_more_steps)}
- Simple language: {bool(simple_language)}

Return JSON in this exact format:
{{
  "task": "{req.task}",
  "steps": [
    {{
      "step": 1,
      "text": "...",
      "micro_win": "..."
    }}
  ]
}}
"""

    result = generate_llm_steps(prompt)

    # 🆕 SAVE TASK HISTORY (SAFE)
    cursor.execute(
        """
        INSERT INTO tasks (email, task, steps, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (
            req.email,
            req.task,
            json.dumps(result),
            datetime.utcnow().isoformat()
        )
    )
    conn.commit()

    return result

# ======================
# TASK HISTORY
# ======================
@app.get("/task-history")
def task_history(email: str, limit: int = 5):
    cursor.execute(
        """
        SELECT task, steps, created_at
        FROM tasks
        WHERE email = ?
        ORDER BY id DESC
        LIMIT ?
        """,
        (email, limit)
    )

    rows = cursor.fetchall()

    return [
        {
            "task": r[0],
            "steps": json.loads(r[1]),
            "created_at": r[2]
        }
        for r in rows
    ]

# ======================
# GAMES (OPTIONAL)
# ======================
#@app.get("/games/focus")
#def focus_game():
 #   return {
  #      "game": "2-minute focus challenge",
   #     "rules": "Work on your current task without switching apps for 2 minutes."
    #}

# ======================
# HEALTH CHECK
# ======================
@app.get("/")
def health():
    return {"status": "backend running"}