import React from "react";
import List from "./List";
import ReactDOM from "react-dom/client";

export default (el: any) => {

    const root = ReactDOM.createRoot(el);
    root.render(<List />);
}