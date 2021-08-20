import React from "react";
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import Finder from "./pages/Finder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Matchs from "./pages/Matchs";
import MatchDetails from "./pages/Matchs/matchDetails";
import Profile from "./pages/Profile";
import AddProduct from "./pages/Products/addProduct";
import ModifyProduct from "./pages/Products/modifyProduct";
import ProductDetails from "./pages/Products/productDetails";
import Proposal from "./pages/Finder/proposal";
import Chat from "./pages/Chat";
import Swaps from "./pages/Swaps";
import ErrorPage from "./pages/ErrorPage";
import Admin from "./pages/Admin/";
import Mail from "./pages/Admin/mail";
import AdminProducts from "./pages/Admin/products";

import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";
import {
  Favorite,
  LocalMall,
  SwapHoriz,
  Person,
  Search,
} from "@material-ui/icons";

export default function Routes() {
  return (
    <HashRouter>
      <AppBar id="bottomBar">
        <BottomNavigation showLabels>
          <BottomNavigationAction
            className="bottomBtn"
            label="Finder"
            icon={<Search />}
            component={Link}
            to="/finder"
          />
          <BottomNavigationAction
            className="bottomBtn"
            label="Matchs"
            icon={<Favorite />}
            component={Link}
            to="/matches"
          />
          <BottomNavigationAction
            className="bottomBtn"
            label="Produits"
            icon={<LocalMall />}
            component={Link}
            to="/products"
          />
          <BottomNavigationAction
            className="bottomBtn"
            label="Profil"
            icon={<Person />}
            component={Link}
            to="/profile"
          />
          <BottomNavigationAction
            className="bottomBtn"
            label="Swaps"
            icon={<SwapHoriz />}
            component={Link}
            to="/swaps"
          />
        </BottomNavigation>
      </AppBar>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/finder" exact component={Finder} />
        <Route path="/products" exact component={Products} />
        <Route path="/addProduct" exact component={AddProduct} />
        <Route
          path="/modifyProduct/:productId"
          exact
          component={ModifyProduct}
        />
        <Route
          path="/productDetails/:productId"
          exact
          component={ProductDetails}
        />
        <Route path="/proposal/:productId" exact component={Proposal} />
        <Route path="/matches" exact component={Matchs} />
        <Route
          path="/match/:consignee/:productId/:isProposition"
          exact
          component={MatchDetails}
        />
        <Route path="/chat/:userId" exact component={Chat} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/swaps" exact component={Swaps} />
        <Route path="/admin" exact component={Admin} />
        <Route path="/admin/mail/:email" exact component={Mail} />
        <Route path="/admin/products/:userId" exact component={AdminProducts} />
        <Route component={ErrorPage} />
      </Switch>
    </HashRouter>
  );
}
