import { FiSun } from "react-icons/fi";
import { BsMoonStarsFill } from "react-icons/bs";
import { GoDeviceDesktop } from "react-icons/go";
import { TbLogin } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
//

export const navLinks = [
  {
    title: "login",
    path: "/login",
    icon: TbLogin,
  },
  {
    title: "my page",
    path: "/mypage",
    icon: CgProfile,
  },
];

export const themeOptions = [
  {
    title: "Dark",
    icon: BsMoonStarsFill,
  },
  {
    title: "Light",
    icon: FiSun,
  },
  {
    title: "System",
    icon: GoDeviceDesktop,
  },
];

export const footerLinks = [
  "home",
  "live",
  "you must watch",
  "contact us",
  "FAQ",
  "Recent release",
  "term of services",
  "premium",
  "Top IMDB",
  "About us",
  "Privacy policy",
];
