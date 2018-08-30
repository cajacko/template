// @flow

import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Router = ({ routes }) => (
  <BrowserRouter>
    <Switch>{routes.map(r => <Route {...r} key={r.path || ""} />)}</Switch>
  </BrowserRouter>
);

export default Router;
