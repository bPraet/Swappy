import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./products.css";

import { Grid, CircularProgress } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { motion } from "framer-motion";
import api from "../../services/api";
import adress from "../../services/config";

export default function Products({ history }) {
  const [productsUser, setProductsUser] = useState([]);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    api
      .get("/productsUser", { headers: { userToken: userToken } })
      .then((result) => {
        setProductsUser(result);
      })
      .catch((err) => {
        localStorage.removeItem("userToken");
        history.push("/");
      });

    document.getElementById("bottomBar").style.display = "block";
  }, [history]);

  if (productsUser.data === undefined) return <CircularProgress size="100px" />;

  const getProducts = () => {
    const products = [];

    for (let i = 0; i < 12; i++) {
      if (productsUser.data[i])
        products.push(
          <Grid item xs={3} key={i}>
            <Link to={"/modifyProduct/" + productsUser.data[i]._id}>
              <img
                src={adress + "/files/" + productsUser.data[i].image}
                className="productImg"
                alt={`product${i + 1}`}
                draggable="false"
              ></img>
            </Link>
          </Grid>
        );
    }

    const emptyProducts = 12 - products.length;
    const currentProducts = products.length;
    for (let i = 0; i < emptyProducts; i++) {
      if (i === 0)
        products.push(
          <Grid
            item
            xs={3}
            key={currentProducts + i}
            id="addProductContainer"
            component={Link}
            to={"/addProduct"}
          >
            <Add className="productImg" id="addProductGrid" />
          </Grid>
        );
      else
        products.push(
          <Grid item xs={3} key={currentProducts + i}>
            <div
              className="productImg"
              alt={`product${currentProducts + i + 1}`}
            ></div>
          </Grid>
        );
    }

    return products;
  };

  return (
    <div id="products">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Grid container spacing={1} className="productContainer">
          {getProducts()}
        </Grid>
      </motion.div>
    </div>
  );
}
