import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditDisc = () => {
  const { id } = useParams();

  const [discos, setDiscos] = useState({
    banda: "",
    disco: "",
    lanzamiento: "",
    category_id: "",
    origin: ""
  });
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios
      .get("https://viny-record-api.vercel.app/auth/category")
      .then((res) => {
        if (res.data.Status) {
          setCategory(res.data.Result);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`https://viny-record-api.vercel.app/auth/disc/${id}`)
      .then((res) => {
        if (res.data.Status) {
          const disc = res.data.Result[0];
          setDiscos({
            banda: disc.banda,
            disco: disc.disco,
            lanzamiento: disc.lanzamiento,
            category_id: disc.category_id,
            origin: disc.origin
          });
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("banda", discos.banda);
    formData.append("disco", discos.disco);
    formData.append("lanzamiento", discos.lanzamiento);
    formData.append("category_id", discos.category_id);
    formData.append("origin", discos.origin);

    axios
      .put(`https://viny-record-api.vercel.app/auth/edit_disc/${id}`, formData)
      .then((res) => {
        if (res.data.Status) {
          alert("Banda editada correctamente!!!");
          navigate("/dashboard/disc");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h4 className="text-center text-uppercase">Editar Banda</h4>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputBanda" className="form-label">
              Banda
            </label>
            <input
              id="inputBanda"
              type="text"
              className="form-control rounded bg-transparent text-black"
              placeholder="Ingrese Banda"
              value={discos.banda}
              onChange={(e) => setDiscos({ ...discos, banda: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputDisco" className="form-label">
              Disco
            </label>
            <input
              id="inputDisco"
              type="text"
              placeholder="Ingrese Disco"
              value={discos.disco}
              className="form-control rounded bg-transparent text-black"
              onChange={(e) => setDiscos({ ...discos, disco: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputLanzamiento" className="form-label">
              Lanzamiento
            </label>
            <input
              id="inputLanzamiento"
              type="date"
              name="disc"
              placeholder="Ingrese Año"
              value={discos.lanzamiento}
              className="form-control rounded bg-transparent text-black"
              onChange={(e) =>
                setDiscos({ ...discos, lanzamiento: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Categoria
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={discos.category_id}
              onChange={(e) =>
                setDiscos({ ...discos, category_id: e.target.value })
              }
            >
              {category.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="inputOrigin" className="form-label">
              Origen
            </label>
            <input
              id="inputOrigin"
              type="text"
              placeholder="Ingrese Origen"
              value={discos.origin}
              className="form-control rounded bg-transparent text-black"
              onChange={(e) =>
                setDiscos({ ...discos, origin: e.target.value })
              }
            />
          </div>       
          <button
            type="submit"
            className="btn btn-outline-primary w-100 rounded mb-2"
          >
            Editar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDisc;
