import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const DetailDisc = () => {
  const navigate = useNavigate();
  const [discs, setDiscs] = useState([]);

  useEffect(() => {
    fetchDiscs();
  }, []);

  const fetchDiscs = async () => {
    try {
      const response = await axios.get("https://viny-record-api.vercel.app/auth/disc");
      if (response.data.Status) {
        setDiscs(response.data.Result);
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.log("Error fetching discs:", error);
    }
  };

  if (discs.length === 0) {
    return <div>Cargando...</div>;
  }

  const handleLogout = () => {
    axios
      .get("https://viny-record-api.vercel.app/employee/logout", { withCredentials: true })
      .then((response) => {
        if (response.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      }).catch(err => console.log(err));
  };

  return (
    <div className="container">      
      <h1 className="h1t">Vinyl Record || Tienda Online</h1>
      <button className="btne btn btn-danger" onClick={handleLogout}>
        Salir
      </button>
      <div className="row">
        {" "}
        {discs.map((disc) => (
          <div className="col-md-4" key={disc.id}>
            <div className="card2 mb-4">
              <img
                src={`https://viny-record-api.vercel.app/uploads/${disc.image}`}
                className="card-img-top"
                alt={disc.disco}
              />
              <div className="card-body2">
                <h5 className="card-title">Banda: {disc.banda}</h5>
                <p className="card-text">
                  <strong>Disco:</strong> {disc.disco}
                  <br />
                  <strong>Lanzamiento:</strong>{" "}
                  {format(new Date(disc.lanzamiento), "dd-MM-yyyy")}
                  <br />
                  <strong>Género:</strong> {disc.category_name}
                  <br />
                  <strong>Origen:</strong> {disc.origin}
                  <br />
                </p>
                <p className="strong2">
                  <strong>Precio:</strong> $ {disc.price}
                </p>
                <button className="btn btn-primary">Comprar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailDisc;
