import React from "react";
import { Link } from "react-router-dom";
import LogoImg from "../../assets/images/mooncinema.png";
//
const Logo = ({
  className = "",
  logoColor = "text-black dark:text-primary",
}) => (
  <Link
    to="/"
    className={`flex flex-row items-center xs:gap-2 gap-[6px] ${className}`}
  >
    <img
      src={LogoImg}
      alt="logo"
      className="sm:h-[28px] h-[24px] sm:w-[28px] w-[24px]"
    />
    <span
      className={`font-semibold sm:text-[17px] text-[16.75px] text-white ${logoColor} `}
    >
      Moon Cinema
    </span>
  </Link>
);

export default Logo;
