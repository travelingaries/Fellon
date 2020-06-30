import React from "react";

const Button = ({ children, disabled, loading, ...rest }) => {
  return (
    <button disabled={disabled} {...rest}>
      {loading ? loading : children}
    </button>
  );
};

export default Button;
