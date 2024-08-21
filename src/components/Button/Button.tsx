import React from "react";
import "./Button.scss";

interface ButtonProps {
  children: string;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button className="button">{children}</button>;
};

export default Button;
