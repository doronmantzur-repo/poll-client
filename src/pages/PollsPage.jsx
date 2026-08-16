import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Link } from "react-router-dom";
import authStore from "../stores/AuthStore";
import pollStore from "../stores/PollStore";
import CreatePollForm from "../components/CreatePollForm";

function PollsPage() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (authStore.isAuthenticated) {
      pollStore.fetchMyPolls(authStore.user.id);
    }
  }, []);

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="polls-page">
      <div className="polls-header">
        <h1>My Polls</h1>
        <button onClick={() => setShowForm(true)}>+ Create Poll</button>
      </div>

      {showForm && <CreatePollForm onDone={() => setShowForm(false)} />}

      {pollStore.loading && !showForm && <p>Loading polls...</p>}

      {!pollStore.loading && pollStore.polls.length === 0 && (
        <p>You haven't created any polls yet.</p>
      )}

      <ul className="poll-list">
        {pollStore.polls.map((poll) => {
          const answers = Array.from({ length: 8 }, (_, i) => poll[`answer_${i + 1}`]).filter(
            Boolean
          );
          return (
            <li className="poll-card" key={poll.id}>
              <h2>{poll.question}</h2>
              <span className="poll-visibility">{poll.is_public ? "Public" : "Private"}</span>
              <ul>
                {answers.map((answer, i) => (
                  <li key={i}>{answer}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <p>
        <Link to="/">Back home</Link>
      </p>
    </div>
  );
}

export default observer(PollsPage);
