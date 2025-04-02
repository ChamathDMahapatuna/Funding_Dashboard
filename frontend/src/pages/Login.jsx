import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setStatus({ message: "Logging in...", type: "info" });
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      login(res.data.token);
      setStatus({ message: "Login successful!", type: "success" });
      
      // Delay redirect to show success message
      setTimeout(() => {
        navigate("/dashboard"); // Replace with your target route
      }, 1500);
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        setStatus({ 
          message: error.response.data.message || "Invalid credentials", 
          type: "error" 
        });
      } else {
        console.error("Error:", error.message);
        setStatus({ message: "Server error. Please try again later.", type: "error" });
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded">
        <h2 className="text-xl mb-4">Login</h2>
        
        {status.message && (
          <div 
            className={`p-3 mb-3 rounded text-sm ${
              status.type === "success" 
                ? "bg-green-100 text-green-700 border border-green-300" 
                : status.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-blue-100 text-blue-700 border border-blue-300"
            }`}
          >
            {status.message}
          </div>
        )}
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="border p-2 mb-2 w-full" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="border p-2 mb-2 w-full" 
          required 
        />
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;