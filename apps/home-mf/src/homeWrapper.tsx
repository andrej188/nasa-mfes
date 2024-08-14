import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Home";

export default (el: any) => {
  const root = ReactDOM.createRoot(el);
  root.render(<Home />);
};
