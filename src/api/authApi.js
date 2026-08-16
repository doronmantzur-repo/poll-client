import { API_BASE_URL } from "./config";

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export function signup(user_name, password) {
  return postJson("/api/auth/signup", { user_name, password });
}

export function login(user_name, password) {
  return postJson("/api/auth/login", { user_name, password });
}
