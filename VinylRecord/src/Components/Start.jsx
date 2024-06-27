import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Start = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8080/verify")
      .then((response) => {
        if (response.data.Status) {
          if (response.data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/detail_disc");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 liginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <h2 className="text-center">Ingresar como</h2>
        <div className="d-flex justify-content-between mt-5 mb-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => {
              navigate("/adminlogin");
            }}
          >
            Administrador
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => {
              navigate("/employee_login");
            }}
          >
            Empleado
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
