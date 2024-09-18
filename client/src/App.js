import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Landing from "./components/layout/Landing";
import Transactions from "./components/transactions/Transactions";
import Projects from "./components/projects/Projects";
import MyProjects from "./components/myprojects/MyProjects";
import Swap from "./components/swap/Swap";

// Redux
import { Provider } from "react-redux";
import store from "./store";

import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Sidebar />
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/transactions" element={<Transactions />} />
            <Route exact path="/projects" element={<Projects />} />
            <Route exact path="/myprojects" element={<MyProjects />} />
            <Route exact path="/swap" element={<Swap />} />
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
