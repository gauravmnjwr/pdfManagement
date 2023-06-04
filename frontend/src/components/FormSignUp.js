import React, { useState } from "react";
import axios from "axios";

function FormSignUp({ isUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setMessage("Password does not match");
      return;
    }
    try {
      // Send signup request to the backend
      setMessage("");
      const response = await axios.post("/signup", {
        email,
        password,
      });
      console.log(response.data);
      // Clear the form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      isUser();
    } catch (error) {
      setMessage("User Already Exists");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {message && message}
      <form onSubmit={handleSignup}>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default FormSignUp;
