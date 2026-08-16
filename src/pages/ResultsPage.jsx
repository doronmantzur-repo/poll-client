import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Link } from "react-router-dom";
import authStore from "../stores/AuthStore";
import pollStore from "../stores/PollStore";
import PollResultCard from "../components/PollResultCard";

function ResultsPage() {
  useEffect(() => {
    pollStore.fetchResults();
  }, []);

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="polls-page">
      <div className="polls-header">
        <h1>Public Poll Results</h1>
      </div>

      {pollStore.resultsError && <p className="error">{pollStore.resultsError}</p>}
      {pollStore.resultsLoading && <p>Loading results...</p>}

      {!pollStore.resultsLoading && pollStore.resultsPolls.length === 0 && (
        <p>No public polls yet.</p>
      )}

      <ul className="poll-list">
        {pollStore.resultsPolls.map((poll) => (
          <PollResultCard poll={poll} key={poll.id} />
        ))}
      </ul>

      <p>
        <Link to="/">Back home</Link>
      </p>
    </div>
  );
}

export default observer(ResultsPage);
