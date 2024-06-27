import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDisc = () => {
  const [discos, setDiscos] = useState({
    banda: "",
    disco: "",
    lanzamiento: "",
    category_id: "",
    image: null,
    origin: "",
    price: "",
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("banda", discos.banda);
    formData.append("disco", discos.disco);
    formData.append("origin", discos.origin);
    formData.append("price", discos.price);
    formData.append("lanzamiento", discos.lanzamiento);
    formData.append("category_id", discos.category_id);
    formData.append("image", discos.image);

    axios
      .post("https://viny-record-api.vercel.app/auth/add_disc", formData)
      .then((res) => {
        if (res.data.Status) {
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
        <h4 className="text-center text-uppercase">Agregar Banda</h4>
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
              className="form-control rounded bg-transparent text-black"
              onChange={(e) => setDiscos({ ...discos, disco: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputOrigin" className="form-label">
              Origen
            </label>
            <input
              id="inputOrigin"
              type="text"
              placeholder="Ingrese Origen"
              className="form-control rounded bg-transparent text-black"
              onChange={(e) => setDiscos({ ...discos, origin: e.target.value })}
            />
          </div>
          <div className="col-3">
            <label htmlFor="inputPrice" className="form-label">
              Precio
            </label>
            <input
              id="inputPrice"
              type="text"
              placeholder="Ingrese Precio"
              className="form-control rounded bg-transparent text-black"
              onChange={(e) => setDiscos({ ...discos, price: e.target.value })}
            />
          </div>
          <div className="col-6">
            <label htmlFor="inputLanzamiento" className="form-label">
              Lanzamiento
            </label>
            <input
              id="inputLanzamiento"
              type="date"
              name="disc"
              placeholder="Ingrese Año"
              className="form-control rounded bg-transparent text-black"
              onChange={(e) =>
                setDiscos({ ...discos, lanzamiento: e.target.value })
              }
            />
          </div>
          <div className="col-3">
            <label htmlFor="category" className="form-label">
              Categoria
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              onChange={(e) =>
                setDiscos({ ...discos, category_id: e.target.value })
              }
            >
              {category.map((c) => {
                return (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-9 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">
              Elegir Portada
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              name="image"
              onChange={(e) =>
                setDiscos({ ...discos, image: e.target.files[0] })
              }
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

export default AddDisc;
