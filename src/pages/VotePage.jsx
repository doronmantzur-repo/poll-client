import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Link } from "react-router-dom";
import authStore from "../stores/AuthStore";
import pollStore from "../stores/PollStore";

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

      {pollStore.browseError && <p className="error">{pollStore.browseError}</p>}
      {pollStore.browseLoading && <p>Loading polls...</p>}

      {!pollStore.browseLoading && pollStore.browsePolls.length === 0 && (
        <p>No polls to show yet.</p>
      )}

      <ul className="poll-list">
        {pollStore.browsePolls.map((poll) => {
          const hasVoted = (poll.my_answers || []).length > 0;
          const isOwnPoll = poll.user_id === authStore.user.id;

          return (
            <li className="poll-card" key={poll.id}>
              <h2>{poll.question}</h2>
              <span className="poll-visibility">
                {poll.is_public ? "Public" : "Private"}
                {isOwnPoll ? " · Your poll" : ""}
              </span>

              {hasVoted ? (
                <p className="my-answer">You voted: {poll.my_answers.join(", ")}</p>
              ) : (
                <p>
                  <Link to={`/polls/${poll.id}`}>Vote on this poll &rarr;</Link>
                </p>
              )}
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

export default observer(VotePage);
