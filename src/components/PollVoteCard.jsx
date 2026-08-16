import { useState } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../stores/AuthStore";
import pollStore from "../stores/PollStore";

function PollVoteCard({ poll }) {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const answers = Array.from({ length: 8 }, (_, i) => poll[`answer_${i + 1}`]).filter(Boolean);
  const myAnswers = poll.my_answers || [];
  const hasVoted = myAnswers.length > 0;
  const isOwnPoll = poll.user_id === authStore.user.id;

  async function handleVote(e) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    await pollStore.submitAnswer(poll.id, authStore.user.id, selected);
    setSubmitting(false);
  }

  return (
    <li className="poll-card">
      <h2>{poll.question}</h2>
      <span className="poll-visibility">
        {poll.is_public ? "Public" : "Private"}
        {isOwnPoll ? " · Your poll" : ""}
      </span>

      {hasVoted ? (
        <p className="my-answer">You voted: {myAnswers.join(", ")}</p>
      ) : (
        <form onSubmit={handleVote}>
          {answers.map((answer, i) => (
            <label key={i} className="vote-option">
              <input
                type="radio"
                name={`poll-${poll.id}`}
                checked={selected === answer}
                onChange={() => setSelected(answer)}
              />
              {answer}
            </label>
          ))}
          <button type="submit" disabled={!selected || submitting}>
            {submitting ? "Submitting..." : "Submit Vote"}
          </button>
        </form>
      )}
    </li>
  );
}

export default observer(PollVoteCard);
