import React, { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import TinderCard from "react-tinder-card";

import "./finder.css";

import { CircularProgress, IconButton } from "@material-ui/core";
import { InfoOutlined } from "@material-ui/icons";
import { motion } from "framer-motion";

import api from "../../services/api";
import adress from "../../services/config";

export default function Finder({ history }) {
  const [products, setProducts] = useState([]);
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    api
      .get("/products/notseen", { headers: { userToken: userToken } })
      .then((result) => {
        result.data.reverse();
        setProducts(result);
      })
      .catch((err) => {
        localStorage.removeItem("userToken");
        history.push("/");
      });
  }, [history, update]);

  if (products.data === undefined) return <CircularProgress size="100px" />;

  const onCardLeftScreen = async (direction, productId) => {
    const userToken = localStorage.getItem("userToken");

    try {
      if (direction === "left") {
        await api
          .post(
            "/track/add",
            { productId },
            { headers: { userToken: userToken } }
          )
          .then(forceUpdate());
      } else {
        await api.post(
          "/track/add",
          { productId },
          { headers: { userToken: userToken } }
        );
        history.push(`/proposal/${productId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="finder">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div id="swipeContainer">
          <div id="emptyCard"></div>
          {products.data.map((product) => (
            <TinderCard
              preventSwipe={["up", "down"]}
              key={product._id}
              onCardLeftScreen={(direction) =>
                onCardLeftScreen(direction, `${product._id}`)
              }
            >
              <div
                className="card"
                style={{
                  backgroundImage: `url(${adress + "/files/" + product.image})`,
                }}
              >
                <IconButton
                  aria-label="productDetails"
                  id="infoContainer"
                  component={Link}
                  to={"/productDetails/" + product._id}
                  onTouchStart={() =>
                    history.push(`/productDetails/` + product._id)
                  }
                >
                  <InfoOutlined id="infoBtn" />
                </IconButton>
              </div>
            </TinderCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
