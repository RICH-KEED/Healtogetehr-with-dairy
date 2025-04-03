import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import DiaryPage from "./pages/DiaryPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/diary" element={<DiaryPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default AppRouter;