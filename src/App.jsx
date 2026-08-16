import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PollsPage from "./pages/PollsPage";
import VotePage from "./pages/VotePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/polls" element={<PollsPage />} />
        <Route path="/vote" element={<VotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
