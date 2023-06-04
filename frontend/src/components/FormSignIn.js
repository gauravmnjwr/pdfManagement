import React, { useState } from "react";
import axios from "axios";

function FormSignIn({ isUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post("/login", { email, password });
      console.log(response.data);
      // Clear the form
      setMessage("");
      setEmail("");
      setPassword("");
      isUser();
    } catch (error) {
      setMessage("Invalid Email or Password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && message}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default FormSignIn;
