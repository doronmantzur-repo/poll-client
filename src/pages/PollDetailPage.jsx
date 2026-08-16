import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useLocation, Navigate, Link } from "react-router-dom";
import authStore from "../stores/AuthStore";
import pollStore from "../stores/PollStore";
import PollVoteCard from "../components/PollVoteCard";

function PollDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (authStore.isAuthenticated) {
      pollStore.fetchPollById(id, authStore.user.id);
    }
  }, [id]);

  if (!authStore.isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname, message: "Please log in to vote on this poll." }}
        replace
      />
    );
  }

  return (
    <div className="polls-page">
      <div className="polls-header">
        <h1>Poll</h1>
      </div>

      {pollStore.selectedPollLoading && <p>Loading poll...</p>}
      {pollStore.selectedPollError && <p className="error">{pollStore.selectedPollError}</p>}
      {pollStore.voteError && <p className="error">{pollStore.voteError}</p>}

      {pollStore.selectedPoll && (
        <ul className="poll-list">
          <PollVoteCard poll={pollStore.selectedPoll} />
        </ul>
      )}

      <p>
        <Link to="/vote">Back to Vote on Polls</Link>
      </p>
    </div>
  );
}

export default observer(PollDetailPage);
