import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Disc from "./Components/Disc";
import Category from "./Components/Category";
import Profile from "./Components/Profile";
import AddCategory from "./Components/AddCategory";
import AddDisc from "./Components/AddDisc";
import EditDisc from "./Components/EditDisc";
import HomeDashboard from "./Components/HomeDashboard";
import Home from "./Components/Home";
import DetailDisc from "./Components/DetailDisc";
import Start from "./Components/Start";
import EmployeeLogin from "./Components/EmployeeLogin";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Start />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/employee_login" element={<EmployeeLogin />} />
        <Route path="/detail_disc" element={<DetailDisc />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<HomeDashboard />} />
          <Route path="disc" element={<Disc />} />
          <Route path="category" element={<Category />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add_category" element={<AddCategory />} />
          <Route path="add_disc" element={<AddDisc />} />
          <Route path="edit_disc/:id" element={<EditDisc />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
