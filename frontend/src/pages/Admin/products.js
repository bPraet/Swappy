import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { CircularProgress } from "@material-ui/core";

import "./admin.css";

import { motion } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import api from "../../services/api";
import adress from "../../services/config";

export default function AdminProducts({ history }) {
  const [products, setProducts] = useState([]);

  const userToken = localStorage.getItem("userToken");
  const { userId } = useParams();

  useEffect(() => {
    api
      .get(`/admin/products/${userId}`, { headers: { userToken: userToken } })
      .then((result) => {
        result.data.forEach((product, i) => {
          product.id = i + 1;
        });
        setProducts(result.data);
      })
      .catch((err) => {
        history.push("/");
      });
  }, [history, userToken, userId]);

  if (products === undefined) return <CircularProgress size="100px" />;

  const getImage = (params) => {
    return (
      <Zoom
        overlayBgColorStart="rgba(43, 45, 66, 0)"
        overlayBgColorEnd="rgba(43, 45, 66, 0.95)"
      >
        <img
          src={adress + "/files/" + params.row.image}
          alt={params.row.name}
          className="adminGridImg"
        ></img>
      </Zoom>
    );
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "name",
      headerName: "Nom",
      width: 200,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
    {
      field: "image",
      headerName: "Image",
      width: 250,
      renderCell: getImage,
    },
    {
      field: "condition",
      headerName: "Condition",
      width: 250,
      valueGetter: (params) => params.row.condition.name,
    },
    {
      field: "transport",
      headerName: "Transport",
      width: 200,
      valueGetter: (params) => params.row.transport.name,
    },
  ];

  return (
    <div id="adminContainer">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h1>Produits de l'utilisateur</h1>

        <div id="usersGridContainer">
          <Link to={"/admin"}>Retour</Link>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
            disableSelectionOnClick
          />
        </div>
      </motion.div>
    </div>
  );
}
