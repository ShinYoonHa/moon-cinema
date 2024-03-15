import { NavLink } from "react-router-dom";
import { listItem, activeListItem } from "../../styles";
//
const SidebarNavItem = ({ link, closeSideBar }) => {
  return (
    <li>
      <NavLink
        to={link.path}
        className={({ isActive }) => {
          return isActive ? `${listItem} ${activeListItem}` : `${listItem} `;
        }}
        onClick={closeSideBar}
      >
        {<link.icon className="text-[18px]" />}
        <span>{link.title}</span>
      </NavLink>
    </li>
  );
};

export default SidebarNavItem;
