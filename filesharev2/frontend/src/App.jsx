import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";
import CreateRoom from "./pages/CreateRoom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room" element={<Room />} />
        <Route path="/create-room" element={<CreateRoom />} />
      </Routes>
    </BrowserRouter>
  );
}