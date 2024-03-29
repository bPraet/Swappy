import React, { useState, useEffect } from "react";

import "./matchs.css";

import {
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { motion } from "framer-motion";

import api from "../../services/api";

export default function Matchs({ history }) {
  const [matchs, setMatchs] = useState([]);
  const [propositions, setPropositions] = useState([]);
  const [isPropositionsSet, setIsPropositionsSet] = useState(false);
  const [isMatchsSet, setIsMatchsSet] = useState(false);
  const userToken = localStorage.getItem("userToken");

  let [propositionsGrid] = useState([]);
  let [matchsGrid] = useState([]);

  useEffect(() => {
    if (matchs.data === undefined) {
      api
        .get("/matchs", { headers: { userToken: userToken } })
        .then((result) => {
          setMatchs(result);
        })
        .catch((err) => {
          localStorage.removeItem("userToken");
          history.push("/");
        });
    }

    if (propositions.data === undefined) {
      api
        .get("/propositions", { headers: { userToken: userToken } })
        .then((result) => {
          setPropositions(result);
        })
        .catch((err) => {
          history.push("/");
        });
    }
  }, [matchs, propositions, history, userToken]);

  if (matchs.data === undefined || propositions.data === undefined)
    return <CircularProgress size="100px" />;

  const getMatchs = () => {
    if (!isMatchsSet) {
      setIsMatchsSet(true);
      for (const [i, match] of matchs.data.entries()) {
        matchsGrid.push(
          <span key={i}>
            <ListItem
              button
              onClick={() =>
                history.push(
                  `/match/${match.consignee._id}/${match.productOwner._id}/0`
                )
              }
            >
              <ListItemText
                primary={match.productOwner.name}
                secondary={match.consignee.pseudo}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="send"
                  onClick={() => {
                    history.push(`/chat/${match.consignee._id}`);
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
    }

    return matchsGrid;
  };

  const getPropositions = () => {
    if (!isPropositionsSet) {
      setIsPropositionsSet(true);

      for (const [i, proposition] of propositions.data.entries()) {
        propositionsGrid.push(
          <span key={i}>
            <ListItem
              button
              onClick={() =>
                history.push(
                  `/match/${proposition.owner._id}/${proposition.productOwner._id}/1`
                )
              }
            >
              <ListItemText
                primary={proposition.productOwner.name}
                secondary={proposition.owner.pseudo}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="send"
                  onClick={() => {
                    history.push(`/chat/${proposition.owner._id}`);
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
    }

    return propositionsGrid;
  };

  return (
    <div id="matchs">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h1>Matchs</h1>
        <List component="nav" aria-label="matches">
          {getMatchs()}
          {matchs.data.length === 0 ? (
            <div style={{ textAlign: "center", color: "white" }}>
              Vous n'avez pas de match
            </div>
          ) : (
            ""
          )}
        </List>
        <h1>Propositions</h1>
        <List component="nav" aria-label="propositions">
          {getPropositions()}
          {propositions.data.length === 0 ? (
            <div style={{ textAlign: "center", color: "white" }}>
              Vous n'avez pas de proposition
            </div>
          ) : (
            ""
          )}
        </List>
      </motion.div>
    </div>
  );
}
