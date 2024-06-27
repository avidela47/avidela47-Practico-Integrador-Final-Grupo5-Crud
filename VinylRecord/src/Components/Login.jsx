import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://viny-record-api.vercel.app/auth/adminlogin", values)
      .then((res) => {
        if (res.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate("/dashboard");
        } else {
          setError(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 liginPage">
      <div className="p-3 rounded w-10 border loginForm">
        <div className="text-warning text-center">
          {error && <h6>{error}</h6>}
        </div>
        <h2 className="text-center">Ingresar</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Ingrese email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded bg-transparent text-white"
              required="true"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Ingrese password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded bg-transparent text-white"
              required="true"
            />
          </div>
          <button type="submit" className="btn btn-outline-primary w-100 rounded mb-2">
            Ingresar
          </button>          
        </form>
      </div>
    </div>
  );
};

export default Login;
