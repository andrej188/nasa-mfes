import React, { useRef, useEffect} from "react";
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
        <div className="flex flex-col h-screen">
          <nav className="bg-gray-100 border-b border-gray-300 p-4">
            <ul className="flex list-none p-0 m-0 space-x-4 text-xl">
              <li>
                <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
              </li>
              <li>
                <Link to="/list" className="text-blue-500 hover:text-blue-700">List</Link>
              </li>
            </ul>
          </nav>
  
          <div className="flex-1 overflow-hidden p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/list" element={<List />} />
            </Routes>
          </div>
        </div>
      </Router>
  );

};

ReactDOM.render(<App />, document.getElementById("app"));
