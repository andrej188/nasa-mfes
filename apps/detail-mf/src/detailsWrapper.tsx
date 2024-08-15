import Details from "./Details";
import React from "react";
import ReactDOM from "react-dom/client";

export default (el: any, id: any) => {

    const root = ReactDOM.createRoot(el);
    root.render(<Details params={id} />);
}