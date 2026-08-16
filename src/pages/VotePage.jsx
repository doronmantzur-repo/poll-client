import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Link } from "react-router-dom";
import authStore from "../stores/AuthStore";
import pollStore from "../stores/PollStore";
import PollVoteCard from "../components/PollVoteCard";

function VotePage() {
  useEffect(() => {
    if (authStore.isAuthenticated) {
      pollStore.fetchBrowsePolls(authStore.user.id);
    }
  }, []);

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="polls-page">
      <div className="polls-header">
        <h1>Vote on Polls</h1>
      </div>

      {pollStore.voteError && <p className="error">{pollStore.voteError}</p>}
      {pollStore.browseError && <p className="error">{pollStore.browseError}</p>}
      {pollStore.browseLoading && <p>Loading polls...</p>}

      {!pollStore.browseLoading && pollStore.browsePolls.length === 0 && (
        <p>No polls to show yet.</p>
      )}

      <ul className="poll-list">
        {pollStore.browsePolls.map((poll) => (
          <PollVoteCard poll={poll} key={poll.id} />
        ))}
      </ul>

      <p>
        <Link to="/">Back home</Link>
      </p>
    </div>
  );
}

export default observer(VotePage);
