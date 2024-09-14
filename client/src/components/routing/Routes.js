import React from "react";
import { Route, Switch } from "react-router-dom";
import Projects from "../projects/Projects";
import Swap from "../swap/Swap";

const Routes = () => {
  return (
    <section className="container">
      <Switch>
        <Route exact path="/projects" component={Projects} />
        <Route exact path="/swap" component={Swap} />
      </Switch>
    </section>
  );
};

export default Routes;
