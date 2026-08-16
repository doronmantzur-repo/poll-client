import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import authStore from "../stores/AuthStore";

function SignupPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await authStore.signup(userName, password);
    if (success) {
      navigate("/");
    }
  }

  return (
    <div className="auth-page">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user_name">Username</label>
        <input
          id="user_name"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {authStore.error && <p className="error">{authStore.error}</p>}

        <button type="submit" disabled={authStore.loading}>
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
