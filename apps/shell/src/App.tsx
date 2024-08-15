import React, { useRef, useEffect, createContext, useContext} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import homeWrapper from "home/homeWrapper";
import listWrapper from "list/listWrapper";

import "./index.scss";

const Home = () => {
  const divRef = useRef(null);

  useEffect(() => {
    homeWrapper(divRef.current);
  }, []);

  return (
    <div ref={divRef}></div>
  );
};

const List = () => {
  const divRef = useRef(null);

  useEffect(() => {
    listWrapper(divRef.current);
  }, []);
  return (
    <div ref={divRef}></div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-blue-500 hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/list" className="text-blue-500 hover:underline">List</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
