import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authStore from "../stores/AuthStore";

function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message;
  const redirectTo = location.state?.from || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await authStore.login(userName, password);
    if (success) {
      navigate(redirectTo);
    }
  }

  return (
    <div className="auth-page">
      <h1>Log In</h1>
      {redirectMessage && <p className="info">{redirectMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="user_name">Username</label>
        <input
          id="user_name"
          type="text"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
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

        {authStore.error && <p className="error">{authStore.error}</p>}

        <button type="submit" disabled={authStore.loading}>
          {authStore.loading && <span className="spinner" />}
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
