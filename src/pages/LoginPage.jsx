import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import authStore from "../stores/AuthStore";

function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await authStore.login(userName, password);
    if (success) {
      navigate("/");
    }
  }

  return (
    <div className="auth-page">
      <h1>Log In</h1>
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
          {authStore.loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default observer(LoginPage);
