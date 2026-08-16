import { API_BASE_URL } from "./config";

export async function getMyPolls(userId) {
  const response = await fetch(`${API_BASE_URL}/api/polls?user_id=${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function getBrowsePolls(userId) {
  const response = await fetch(`${API_BASE_URL}/api/polls/browse?user_id=${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function getPublicResults() {
  const response = await fetch(`${API_BASE_URL}/api/polls/results`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function publishPoll(pollId, userId) {
  const response = await fetch(`${API_BASE_URL}/api/polls/${pollId}/publish`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function updatePoll(pollId, question, answers, userId) {
  const response = await fetch(`${API_BASE_URL}/api/polls/${pollId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, answers, user_id: userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function deletePoll(pollId, userId) {
  const response = await fetch(`${API_BASE_URL}/api/polls/${pollId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function createPoll(question, answers, isPublic, userId) {
  const response = await fetch(`${API_BASE_URL}/api/polls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      answers,
      is_public: isPublic,
      user_id: userId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}
