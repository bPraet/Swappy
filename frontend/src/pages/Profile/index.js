import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import "./profile.css";

import {
  FormControl,
  TextField,
  Fab,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Input,
  InputLabel,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import {
  Done,
  RotateLeft,
  ArrowBack,
  ExitToApp,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import logo from "../../assets/logo.png";
import { motion } from "framer-motion";

export default function Profile({ history }) {
  let [email, setEmail] = useState();
  let [password, setPassword] = useState("");
  let [firstName, setFirstnName] = useState();
  let [lastName, setLastName] = useState();
  let [pseudo, setPseudo] = useState();
  let [adress, setAdress] = useState();
  let [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    api
      .get("/user", { headers: { userToken: userToken } })
      .then((result) => {
        setUser(result);
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("userToken");
        history.push("/");
      });

    api
      .get("/isAdmin", { headers: { userToken: userToken } })
      .then((result) => {
        setIsAdmin(result.data);
      })
      .catch((err) => {
        history.push("/");
      });
  }, [history, userToken]);

  if (user === undefined) return <CircularProgress size="100px" />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email === undefined) email = user.data.email;
    if (firstName === undefined) firstName = user.data.firstName;
    if (lastName === undefined) lastName = user.data.lastName;
    if (pseudo === undefined) pseudo = user.data.pseudo;
    if (adress === undefined) adress = user.data.adress;

    try {
      const response = await api.put(
        "/user/update",
        { email, password, firstName, lastName, pseudo, adress },
        { headers: { userToken: userToken } }
      );
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response.data);
    }
    setOpenMessage(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const handleReset = async () => {
    await api.delete("/track/reset", { headers: { userToken: userToken } });
    setOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    history.push("/");
  };

  return (
    <div id="profile">
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
        <form id="profileForm" onSubmit={handleSubmit}>
          <FormControl className="registerForm">
            <TextField
              id="email"
              label="Email"
              defaultValue={user.data.email}
              type="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormControl>
          <FormControl className="registerForm">
            <InputLabel htmlFor="password">Mot de passe</InputLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl className="registerForm">
            <TextField
              id="firstName"
              label="Prénom"
              defaultValue={user.data.firstName}
              onChange={(event) => setFirstnName(event.target.value)}
            />
            <TextField
              id="lastName"
              label="Nom"
              defaultValue={user.data.lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <TextField
              id="pseudo"
              label="Pseudo"
              defaultValue={user.data.pseudo}
              onChange={(event) => setPseudo(event.target.value)}
            />
            <TextField
              id="adress"
              label="Adresse"
              defaultValue={user.data.adress}
              onChange={(event) => setAdress(event.target.value)}
            />
          </FormControl>

          <div id="btn">
            <Fab aria-label="previous" id="backBtn" onClick={history.goBack}>
              <ArrowBack />
            </Fab>
            {isAdmin ? (
              <Fab
                arial-label="admin"
                id="adminBtn"
                component={Link}
                to="/admin"
              >
                <img src={logo} height="40px" alt="logo"></img>
              </Fab>
            ) : (
              ""
            )}
            <Fab aria-label="update" id="updateBtn" type="submit">
              <Done />
            </Fab>
          </div>

          <Button
            id="resetBtn"
            variant="contained"
            color="default"
            startIcon={<RotateLeft />}
            onClick={handleClickOpen}
          >
            Reset historique
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Reset l'historique ?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Vous retomberez sur des produits déjà parcourus lors de vos
                futures recherches.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Non
              </Button>
              <Button onClick={handleReset} color="primary" autoFocus>
                Oui
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            id="logoutBtn"
            variant="contained"
            color="default"
            startIcon={<ExitToApp />}
            onClick={logout}
          >
            Déconnexion
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
