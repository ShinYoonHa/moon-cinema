import React from "react";
import { NavLink } from "react-router-dom";
import { textColor } from "../../styles";
//
const HeaderNavItem = ({ link, showBg, isPageNotFound }) => {
  return (
    <li>
      <NavLink
        to={link.path}
        className={({ isActive }) => {
          return isActive
            ? `nav-link active ${showBg ? textColor : `text-secColor`}`
            : `nav-link ${
                isPageNotFound || showBg
                  ? "text-white hover:text-white dark:text-gray-300 dark:hover:text-secColor"
                  : "text-gray-300 hover:text-secColor"
              }`;
        }}
        end
      >
        {link.title}
      </NavLink>
    </li>
  );
};

export default HeaderNavItem;
