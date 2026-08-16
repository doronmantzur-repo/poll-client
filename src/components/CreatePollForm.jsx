import { useState } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../stores/AuthStore";
import pollStore from "../stores/PollStore";

const MAX_ANSWERS = 8;
const MIN_ANSWERS = 2;

function CreatePollForm({ onDone, poll }) {
  const isEditing = Boolean(poll);
  const initialAnswers = isEditing
    ? Array.from({ length: 8 }, (_, i) => poll[`answer_${i + 1}`]).filter(Boolean)
    : ["", ""];

  const [question, setQuestion] = useState(isEditing ? poll.question : "");
  const [answers, setAnswers] = useState(initialAnswers);
  const [isPublic, setIsPublic] = useState(true);
  const [formError, setFormError] = useState(null);

  function updateAnswer(index, value) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
  }

  function addAnswer() {
    if (answers.length < MAX_ANSWERS) {
      setAnswers((prev) => [...prev, ""]);
    }
  }

  function removeAnswer(index) {
    if (answers.length > MIN_ANSWERS) {
      setAnswers((prev) => prev.filter((_, i) => i !== index));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nonEmptyAnswers = answers.map((a) => a.trim()).filter((a) => a.length > 0);
    if (nonEmptyAnswers.length < MIN_ANSWERS || nonEmptyAnswers.length > MAX_ANSWERS) {
      setFormError(`Please provide between ${MIN_ANSWERS} and ${MAX_ANSWERS} answers.`);
      return;
    }
    setFormError(null);

    const success = isEditing
      ? await pollStore.updatePoll(poll.id, question, nonEmptyAnswers, authStore.user.id)
      : await pollStore.createPoll(question, nonEmptyAnswers, isPublic, authStore.user.id);

    if (success) {
      onDone();
    }
  }

  return (
    <form className="create-poll-form" onSubmit={handleSubmit}>
      <label htmlFor="question">Question</label>
      <input
        id="question"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />

      <label>Answers</label>
      {answers.map((answer, index) => (
        <div className="answer-row" key={index}>
          <input
            type="text"
            placeholder={`Answer ${index + 1}`}
            value={answer}
            onChange={(e) => updateAnswer(index, e.target.value)}
            required={index < MIN_ANSWERS}
          />
          {answers.length > MIN_ANSWERS && (
            <button type="button" onClick={() => removeAnswer(index)}>
              &times;
            </button>
          )}
        </div>
      ))}

      {answers.length < MAX_ANSWERS && (
        <button type="button" className="add-answer" onClick={addAnswer}>
          + Add answer
        </button>
      )}

      {!isEditing && (
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public poll
        </label>
      )}

      {formError && <p className="error">{formError}</p>}
      {pollStore.error && <p className="error">{pollStore.error}</p>}

      <div className="form-actions">
        <button type="button" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" disabled={pollStore.loading}>
          {pollStore.loading ? "Saving..." : isEditing ? "Save Changes" : "Create Poll"}
        </button>
      </div>
    </form>
  );
}

export default observer(CreatePollForm);
