import { useState } from "react";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/api/auth/${
      isLogin ? "login" : "register"
    }`;
    const { data } = await axios.post(url, form);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    alert(`${isLogin ? "Logged in" : "Registered"} as ${data.role}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {!isLogin && (
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user"> User </option>
          <option value="provider"> Service Provider </option>
        </select>
      )}

      <button type="submit">{isLogin ? "Login" : "Register"}</button>
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
        {isLogin ? "Create an account" : "Already have an account?"}
      </p>
    </form>
  );
};

export default AuthPage;
