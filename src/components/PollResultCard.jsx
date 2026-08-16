function PollResultCard({ poll }) {
  const { question, voter_count: voterCount, options } = poll;

  return (
    <li className="poll-card">
      <h2>{question}</h2>
      <p className="result-total">
        Total votes: <strong>{voterCount}</strong>
      </p>

      <ul className="result-list">
        {options.map(({ answer, count }) => {
          const percent = voterCount === 0 ? 0 : Math.round((count / voterCount) * 100);
          return (
            <li className="result-row" key={answer} title={`${answer}: ${count} vote${count === 1 ? "" : "s"}`}>
              <div className="result-label">{answer}</div>
              <div className="result-track">
                <div className="result-fill" style={{ width: `${percent}%` }} />
              </div>
              <div className="result-value">
                {count} vote{count === 1 ? "" : "s"} ({percent}%)
              </div>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export default PollResultCard;
