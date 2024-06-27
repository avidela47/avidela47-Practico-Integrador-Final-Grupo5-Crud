import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomeDashboard = () => {
  const [bandasTotal, setBandasTotal] = useState(0);
  const [discosTotal, setDiscosTotal] = useState(0);
  const [generoTotal, setGeneroTotal] = useState(0);
  const [bandas, setBandas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await bandasCount();
      await discosCount();
      await generoCount();
      await fetchBandasRecords();
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchBandasRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/bandas_records");
      if (response.data.Status) {
        setBandas(response.data.Result);
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.log("Error fetching bandas records:", error);
    }
  };

  const bandasCount = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/bandas_count");
      if (response.data.Status) {
        setBandasTotal(response.data.Result[0].bandas_total);
      }
    } catch (error) {
      console.log("Error fetching bandas count:", error);
    }
  };

  const discosCount = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/discos_count");
      if (response.data.Status) {
        setDiscosTotal(response.data.Result[0].discos_total);
      }
    } catch (error) {
      console.log("Error fetching discos count:", error);
    }
  };

  const generoCount = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/genero_count");
      if (response.data.Status) {
        setGeneroTotal(response.data.Result[0].category_total);
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.log("Error fetching genero count:", error);
    }
  };

  const handleNavigate = () => {
    navigate("/detail_disc");
  };

  return (
    <div>
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Bandas</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{bandasTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Discos</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{discosTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Géneros</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{generoTotal}</h5>
          </div>
        </div>
      </div>
      <div className="mt-4 px-5 pt-3">
        <h3>Lista de Bandas</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Bandas</th>
            </tr>
          </thead>
          <tbody>
            {bandas.map((banda, index) => (
              <tr key={index}>
                <td>{banda.bandas}</td>
                <td>
                  <button className="btn btn-outline-dark btn-sm" onClick={handleNavigate}>
                    Tienda online
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

export default HomeDashboard;
