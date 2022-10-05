import React from 'react';
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => {
    return (
      localStorage.getItem("token")
        ? <Redirect to='/' />
        : <Component {...props} />
    )
  }} />
);
export default PublicRoute;