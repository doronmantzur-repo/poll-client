import { observer } from "mobx-react-lite";
import { Navigate, Link } from "react-router-dom";
import authStore from "../stores/AuthStore";

function HomePage() {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const namePart = authStore.user.user_name.split("@")[0];
  const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  return (
    <div className="auth-page">
      <h1>Welcome, {displayName}!</h1>
      <p>
        <Link to="/polls">My Polls</Link>
      </p>
      <p>
        <Link to="/vote">Vote on Polls</Link>
      </p>
      <p>
        <Link to="/results">Public Poll Results</Link>
      </p>
      <button onClick={() => authStore.logout()}>Log out</button>
    </div>
  );
}

export default observer(HomePage);
