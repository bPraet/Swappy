import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./matchs.css";

import {
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { ArrowBack, Done, Close } from "@material-ui/icons";
import { motion } from "framer-motion";
import api from "../../services/api";
import adress from "../../services/config";

export default function MatchDetails({ history }) {
  const [matchs, setMatchs] = useState([]);
  const [products, setProducts] = useState([]);
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openValidate, setOpenValidate] = useState(false);
  const { consignee, productId, isProposition } = useParams();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    if (user === undefined) {
      api
        .get("/user", { headers: { userToken: userToken } })
        .then((result) => {
          setUser(result);
        })
        .catch((err) => {
          history.push("/");
        });
    }

    if (matchs.data === undefined && user !== undefined) {
      if (isProposition === "0") {
        api
          .get(`/match/${user.data._id}/${consignee}/${productId}`, {
            headers: { userToken: userToken },
          })
          .then((result) => {
            setMatchs(result);
          })
          .catch((err) => {
            history.push("/");
          });
      } else {
        api
          .get(`/match/${consignee}/${user.data._id}/${productId}`, {
            headers: { userToken: userToken },
          })
          .then((result) => {
            setMatchs(result);
          })
          .catch((err) => {
            history.push("/");
          });
      }
    }

    if (matchs.data !== undefined && !loading) {
      setLoading(true);
      matchs.data.map(async (match) => {
        api
          .get(`/product/${match.productConsignee}`, {
            headers: { userToken: userToken },
          })
          .then((result) => {
            setProducts((values) => [...values, result]);
          })
          .catch((err) => {
            history.push("/");
          });

        api
          .get(`/product/${match.productOwner}`, {
            headers: { userToken: userToken },
          })
          .then((result) => {
            setOwnerProducts((values) => [...values, result]);
          })
          .catch((err) => {
            history.push("/");
          });
      });
    }
  }, [
    history,
    matchs,
    loading,
    user,
    consignee,
    isProposition,
    productId,
    userToken,
  ]);

  if (matchs.data === undefined) return <CircularProgress size="100px" />;

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleClickOpenValidate = () => {
    setOpenValidate(true);
  };

  const handleCloseValidate = () => {
    setOpenValidate(false);
  };

  const validateMatch = async (matches) => {
    const swapProducts = products.map((product) => product.data.name);

    if (isProposition === "0") {
      if (
        !(await api
          .get(`/match/${user.data._id}/${consignee}/${productId}`, {
            headers: { userToken: userToken },
          })
          .then((result) => {
            return !!result.data.length;
          }))
      ) {
        return false;
      }
    }

    await api
      .get(`/product/${matches[0].productOwner}`, {
        headers: { userToken: userToken },
      })
      .then((result) => swapProducts.push(result.data.name));
    await api.post(
      `/swap/add`,
      {
        owner: matches[0].owner,
        products: swapProducts,
        consignee: matches[0].consignee,
      },
      { headers: { userToken: userToken } }
    );

    for (const match of matches) {
      await api.delete(`/matchs/delete/${match.productConsignee}`, {
        headers: { userToken: userToken },
      });
      await api.delete(`/product/delete/${match.productConsignee}`, {
        headers: { userToken: userToken },
      });
    }

    await api.delete(`/matchs/delete/${matches[0].productOwner}`, {
      headers: { userToken: userToken },
    });
    await api.delete(`/product/delete/${matches[0].productOwner}`, {
      headers: { userToken: userToken },
    });

    history.push("/matches");
  };

  const removeMatch = async (matches) => {
    await api.delete(
      `/matchs/deleteProposition/${matches[0].productOwner}/${matches[0].consignee}`,
      { headers: { userToken: userToken } }
    );

    history.push("/matches");
  };

  const getProducts = () => {
    const productsGrid = [];

    if (products !== undefined) {
      const sortedProducts = products.sort((a, b) =>
        a.data._id > b.data._id ? 1 : -1
      );

      for (const [i, product] of sortedProducts.entries()) {
        productsGrid.push(
          <Grid
            item
            xs={3}
            key={i}
            component={Link}
            to={"/productDetails/" + product.data._id}
          >
            <img
              src={adress + "/files/" + product.data.image}
              className="matchProductImg"
              alt={product.data.name}
              draggable="false"
            ></img>
          </Grid>
        );
      }
    }

    return productsGrid;
  };

  const getOwnerProduct = () => {
    if (ownerProducts[0] !== undefined) {
      return (
        <Grid
          item
          xs={3}
          key={"productOwner"}
          component={Link}
          to={"/productDetails/" + ownerProducts[0].data._id}
        >
          <img
            src={adress + "/files/" + ownerProducts[0].data.image}
            className="matchProductImg"
            alt={ownerProducts[0].data.name}
            draggable="false"
          ></img>
        </Grid>
      );
    }
  };

  if (products.length > 0) {
    return (
      <div id="products">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Grid container spacing={1} id="matchProductsContainer">
            {getProducts()}
          </Grid>
          <h1>VS</h1>
          <Grid container spacing={1} id="propositionProductContainer">
            <Grid item xs={3} key={"back"} onClick={history.goBack}>
              <ArrowBack className="backIcon" />
            </Grid>

            {getOwnerProduct()}

            <Grid item xs={3} key={"validate"}>
              {products[0].data.user._id !== user.data._id ? (
                <Done onClick={handleClickOpenValidate} className="matchIcon" />
              ) : (
                ""
              )}
              {products[0].data.user._id !== user.data._id ? (
                <Close
                  onClick={handleClickOpenDelete}
                  className="matchIcon"
                  id="delete"
                />
              ) : (
                <Close
                  onClick={handleClickOpenDelete}
                  className="matchIcon bigBtn"
                  id="delete"
                />
              )}

              <Dialog
                open={openValidate}
                onClose={handleCloseValidate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Accepter l'échange ?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Super ! Es-tu sûr vouloir faire cet échange ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseValidate} color="primary">
                    Non
                  </Button>
                  <Button
                    onClick={() => validateMatch(matchs.data)}
                    color="primary"
                    autoFocus
                  >
                    Oui
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Retirer le match ?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Vous ne pourrez pas revenir en arrière et cet échange
                    disparaitra !
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDelete} color="primary">
                    Non
                  </Button>
                  <Button
                    onClick={() => removeMatch(matchs.data)}
                    color="primary"
                    autoFocus
                  >
                    Oui
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </motion.div>
      </div>
    );
  } else {
    return '';
  }
}
