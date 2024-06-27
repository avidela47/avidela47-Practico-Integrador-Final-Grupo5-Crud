import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const Disc = () => {
  const [discos, setDiscos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://viny-record-api.vercel.app/auth/disc")
      .then((res) => {
        if (res.data.Status) {
          setDiscos(res.data.Result);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`https://viny-record-api.vercel.app/auth/delete_disc/${id}`)
      .then((res) => {
        if (res.data.Status) {
          setDiscos(discos.filter((item) => item.id !== id));
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
    <div className="px-5 mt-3" style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <div className="d-flex justify-content-center">
        <h3 className="text-uppercase">Discografias</h3>
      </div>
      <Link to="/dashboard/add_disc" className="btn btn-outline-primary">
        Agregar disco
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Banda</th>
              <th>Portada</th>
              <th>Disco</th>
              <th>Lanzamiento</th>
              <th>Genero</th>
              <th>Origen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {discos.map((item, index) => (
              <tr key={index}>
                <td>{item.banda}</td>
                <td>
                  <img
                    className="img_port"
                    src={`https://viny-record-api.vercel.app/uploads/${item.image}`}
                    alt="portada"
                  />
                </td>
                <td>{item.disco}</td>
                <td>{format(new Date(item.lanzamiento), "dd-MM-yyyy")}</td>
                <td>{item.category_name}</td>
                <td>{item.origin}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_disc/${item.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Editar
                  </Link>{" "}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Disc;
