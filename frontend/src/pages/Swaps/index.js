import React, { useState, useEffect } from "react";

import "./swaps.css";

import {
  List,
  CircularProgress,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { motion } from "framer-motion";

import api from "../../services/api";

export default function Matchs({ history }) {
  const [swaps, setSwaps] = useState([]);
  const [user, setUser] = useState();
  const [swapsGrid] = useState([]);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    api
      .get("/user", { headers: { userToken: userToken } })
      .then((result) => {
        setUser(result);
      })
      .catch((err) => {
        localStorage.removeItem("userToken");
        history.push("/");
      });

    api
      .get("/swaps", { headers: { userToken: userToken } })
      .then((result) => {
        setSwaps(result);
      })
      .catch((err) => {
        history.push("/");
      });
  }, [history]);

  if (swaps.data === undefined) return <CircularProgress size="100px" />;

  const dateFormat = (date) => {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} à ${date.getHours()}h${date.getMinutes()}`;
  }

  const getSwaps = () => {
    for (const [i, swap] of swaps.data.entries()) {
      const swapDetails =
        swap.products.slice(0, -1).join(" - ") +
        " VS " +
        swap.products.slice(-1);

      swapsGrid.push(
        <span key={i}>
          <ListItem>
            <ListItemText
              primary={swapDetails}
              secondary={
                user.data._id === swap.consignee._id
                  ? `${swap.owner.pseudo} - ${dateFormat(new Date(swap.createdAt.toString()))}`
                  : `${swap.consignee.pseudo} - ${dateFormat(new Date(swap.createdAt.toString()))}`
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="send"
                onClick={() => {
                  history.push(
                    `/chat/${
                      user.data._id === swap.consignee._id
                        ? swap.owner._id
                        : swap.consignee._id
                    }`
                  );
                }}
              >
                <Send htmlColor="white" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </span>
      );
    }
    return swapsGrid;
  };

  return (
    <div id="swaps">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h1>Swaps</h1>
        <List component="nav" aria-label="swaps" id="swapsContainer">
          {getSwaps()}
          {swaps.data.length === 0 ? (
            <div style={{ textAlign: "center", color: "white" }}>
              Vous n'avez pas de swaps
            </div>
          ) : (
            ""
          )}
        </List>
      </motion.div>
    </div>
  );
}
