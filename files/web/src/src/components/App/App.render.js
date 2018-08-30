// @flow

import React from "react";
import { Provider } from "react-redux";
import config from "../../config";
import store from "../../store";
import Router from "../Router";

const Error = ({ text }) => {
  const errorMessage = text || "Undefined error";

  console.error(errorMessage);
  return <p>{errorMessage}</p>;
};

const WithRedux = ({ children }) =>
  config.REDUCERS ? <Provider store={store}>{children}</Provider> : children;

const WithRouter = () => {
  if (config.ROUTES) {
    if (!config.ROUTES.length) {
      return <Error text="ROUTES does not contain any routes" />;
    }

    return <Router routes={config.ROUTES} />;
  }

  if (config.ENTRY_COMPONENT) {
    const EntryComponent = config.ENTRY_COMPONENT;
    return <EntryComponent />;
  }

  return (
    <Error text="Error: No ROUTES or ENTRY_COMPONENT defined in the entry file" />
  );
};

const Root = () => (
  <WithRedux>
    <WithRouter />
  </WithRedux>
);

export default Root;
