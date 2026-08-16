import { API_BASE_URL } from "./config";

export async function submitAnswers(pollId, userId, answers) {
  const response = await fetch(`${API_BASE_URL}/api/poll-answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poll_id: pollId, user_id: userId, answers }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
