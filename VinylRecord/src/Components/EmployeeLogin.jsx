import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeLogin = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/employee/employee_login", values)
      .then((res) => {
        if (res.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate("/detail_disc/");
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
            <label htmlFor="email"><strong>Email:</strong></label>
            <input
              type="email"
              name="email"
              value={values.email}
              autoComplete="email"
              placeholder="Ingrese email"
              onChange={handleChange}
              className="form-control rounded bg-transparent text-white"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password:</strong></label>
            <input
              type="password"
              name="password"
              value={values.password}
              autoComplete="current-password"
              placeholder="Ingrese password"
              onChange={handleChange}
              className="form-control rounded bg-transparent text-white"
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-primary w-100 rounded mb-2">Ingresar</button>
          <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" className="me-2" required />
            <label htmlFor="tick">Aceptar términos & condiciones</label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;



