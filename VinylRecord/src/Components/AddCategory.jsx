import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [category, setCategory] = useState();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();    
    axios
      .post("https://viny-record-api.vercel.app/add_category", { category })
      .then((res) => {
        if(res.data.Status) {
          navigate("/dashboard/category");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="d-flex justify-content-center align-items-center h-75">
      <div className="p-3 rounded w-25 border">
        <h4 className="text-center text-uppercase">Agregar Categoria</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="category">
              <strong></strong>
            </label>
            <input
              type="text"
              name="category"
              placeholder="Ingrese categoria"
              onChange={(e) => setCategory(e.target.value)}
              className="form-control rounded bg-transparent text-black"
            />
          </div>
          <button type="submit" className="btn btn-outline-primary w-100 rounded mb-2">
            Agregar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
