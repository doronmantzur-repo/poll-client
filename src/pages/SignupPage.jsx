import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import authStore from "../stores/AuthStore";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!EMAIL_PATTERN.test(userName.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    setFormError(null);

    const success = await authStore.signup(userName.trim(), password);
    if (success) {
      navigate("/");
    }
  }

  return (
    <div className="auth-page">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user_name">Email</label>
        <input
          id="user_name"
          type="email"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            setFormError(null);
            authStore.clearError();
          }}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            authStore.clearError();
          }}
          required
        />

        {formError && <p className="error">{formError}</p>}
        {authStore.error && <p className="error">{authStore.error}</p>}

        <button type="submit" disabled={authStore.loading}>
          {authStore.loading && <span className="spinner" />}
          {authStore.loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default observer(SignupPage);
