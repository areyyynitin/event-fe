import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"
import { AuthProvider } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import Events from "./components/Events";
import Login from "./components/Login";
import Signup from "./components/Signup";
import EventDetails from "./components/EventDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-text">
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
            <Routes>
              <Route path="/" element={<Events />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/event/:id" element={<EventDetails />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;