import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataGrid, frFR } from "@material-ui/data-grid";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { Mail, Block, LocalMall } from "@material-ui/icons";

import "./admin.css";

import { motion } from "framer-motion";
import api from "../../services/api";

export default function Admin({ history }) {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [userChoice, setUserChoice] = useState("");
  const [message, setMessage] = useState("");
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    api
      .get("/admin/users", { headers: { userToken: userToken } })
      .then((result) => {
        result.data.forEach((user, i) => {
          user.id = i + 1;
        });
        setUsers(result.data);
      })
      .catch((err) => {
        history.push("/");
      });
  }, [history, userToken]);

  if (users === undefined) return <CircularProgress size="100px" />;

  const deleteUser = async () => {
    try {
      await api.delete(`/admin/delete/${userChoice}`, {
        headers: { userToken: userToken },
      });
      setOpen(false);
      setMessage("Utilisateur supprimé avec succès !");
      setOpenMessage(true);
      setUsers(users.filter((user) => user._id !== userChoice));
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const setChoice = (userId) => {
    setOpen(true);
    setUserChoice(userId);
  };

  const handleCloseMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMessage(false);
  };

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  const renderActions = (params) => {
    return (
      <div id="adminActions">
        <Link to={`/admin/products/${params.row._id}`}>
          <LocalMall />
        </Link>
        <Link to={`/admin/mail/${params.row.email}`}>
          <Mail />
        </Link>
        <Link to={"#"} onClick={() => setChoice(params.row._id)}>
          <Block />
        </Link>
      </div>
    );
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "firstName",
      headerName: "Nom",
      width: 200,
    },
    {
      field: "lastName",
      headerName: "Prénom",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "adress",
      headerName: "Adresse",
      width: 250,
    },
    {
      field: "pseudo",
      headerName: "Pseudo",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: renderActions,
      sortable: false,
      width: 150,
    },
  ];

  return (
    <div id="adminContainer">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Snackbar
          open={openMessage}
          autoHideDuration={6000}
          onClose={handleCloseMessage}
        >
          <Alert onClose={handleCloseMessage} severity="error">
            {message}
          </Alert>
        </Snackbar>
        <h1>Panneau d'administration</h1>

        <div id="usersGridContainer">
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
            disableSelectionOnClick
            localeText={frFR.props.MuiDataGrid.localeText}
          />
        </div>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Supprimer l'utilisateur ?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action
              est irréversible !
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Non
            </Button>
            <Button onClick={() => deleteUser()} color="primary" autoFocus>
              Oui
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </div>
  );
}
