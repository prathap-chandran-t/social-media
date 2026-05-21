import React from "react";
import { Link } from "react-router-dom";

const Missing = () => {
  return (
    <div>
      <p>Page Not Found</p>

      <Link to="/">Visit Home Page</Link>
    </div>
  );
};

export default Missing;
