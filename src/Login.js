import React, { useState } from "react";
import { users } from "./data/users";
import { useAuth } from "./authContext";

const Login = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleLogin = () => {
    const user = users.find((u) => u.code === code);

    if (user) {
      login({ name: user.name, code: user.code, role: user.role || "user" });
    } else {
      setError("Invalid code. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh_-_200px)] bg-blue-50">
      <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center text-blue-600 font-semibold">
          Enter Code
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <input
          type="password"
          placeholder="Enter your code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-blue-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
