import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import UpdateMessage from './components/UpdateMessage'; // Import UpdateMessage component
// import { AuthProvider } from "./services/AuthContext";

function App() {
  return (
    <>
    <UpdateMessage />
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/" element={<Home />} />
    </Routes>
    </>
  );
}

export default App;
