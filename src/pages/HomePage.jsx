import { observer } from "mobx-react-lite";
import { Navigate, Link } from "react-router-dom";
import authStore from "../stores/AuthStore";

function HomePage() {
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="auth-page">
      <h1>Welcome, {authStore.user.user_name}!</h1>
      <p>
        <Link to="/polls">My Polls</Link>
      </p>
      <button onClick={() => authStore.logout()}>Log out</button>
    </div>
  );
}

export default observer(HomePage);
