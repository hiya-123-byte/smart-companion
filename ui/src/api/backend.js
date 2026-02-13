const BASE_URL = "http://localhost:8000";

// ==============================
// REGISTER USER
// ==============================
export async function registerUser(data) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Register failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
}

// ==============================
// GET USER PROFILE
// ==============================
export async function getUser(email) {
  try {
    const res = await fetch(
      `${BASE_URL}/user?email=${encodeURIComponent(email)}`
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "User fetch failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Get User Error:", error);
    throw error;
  }
}

// ==============================
// DECOMPOSE TASK (LLM CALL)
// ==============================
export async function decomposeTask(email, task) {
  try {
    const res = await fetch(`${BASE_URL}/decompose-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, task }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Task decomposition failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Decompose Task Error:", error);
    throw error;
  }
}

// ==============================
// GET TASK HISTORY
// ==============================
export async function getTaskHistory(email, limit = 5) {
  try {
    const res = await fetch(
      `${BASE_URL}/task-history?email=${encodeURIComponent(
        email
      )}&limit=${limit}`
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Task history fetch failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Task History Error:", error);
    throw error;
  }
}