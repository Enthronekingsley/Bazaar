import React from "react";

interface ButtonProps {
  title: string;
  width?: number | string;
  height?: number | string;
  textColor?: string;
  bgColor?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  title,
  width,
  height,
  textColor,
  bgColor,
  onClick,
}) => {
  return (
    <button
      type="button"
      style={{ width, height, color: textColor, backgroundColor: bgColor }}
      className="rounded-2xl font-medium cursor-pointer hover:opacity-90 transition"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
