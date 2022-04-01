import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { SERVER_BASE_URL } from "../../config/config";
import "./sidebar.scss";

const logoutHandler = () => {
  axios
    .get(`${SERVER_BASE_URL}/api/auth/logout`)
    .then((res) => {
      window.location = "/";
    })
    .catch((err) => {
      window.location = "/";
    });
};

const sidebarNavItems = [
  {
    display: "Dashboard",
    icon: <i className="bx bx-home"></i>,
    to: "/",
    section: "",
  },
  {
    display: "Getting Started",
    icon: <i className="bx bx-star"></i>,
    to: "/started",
    section: "started",
  },
  {
    display: "Calendar",
    icon: <i className="bx bx-calendar"></i>,
    to: "/calendar",
    section: "calendar",
  },
  {
    display: "User",
    icon: <i className="bx bx-user"></i>,
    to: "/user",
    section: "user",
  },
  {
    display: "Orders",
    icon: <i className="bx bx-receipt"></i>,
    to: "/order",
    section: "order",
  },
  {
    display: "SignIn",
    icon: <i class="bx bx-log-in"></i>,
    to: "/signin",
    section: "signin",
  },
];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const sidebarRef = useRef();
  const indicatorRef = useRef();
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      const sidebarItem = sidebarRef.current.querySelector(
        ".sidebar__menu__item"
      );
      indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
      setStepHeight(sidebarItem.clientHeight);
    }, 50);
  }, []);

  // change active index
  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNavItems.findIndex(
      (item) => item.section === curPath
    );
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  return (
    <div className="sidebar">
      <center>
        <div className="sidebar__logo">SmHe❤rt</div>
      </center>
      <div ref={sidebarRef} className="sidebar__menu">
        <div
          ref={indicatorRef}
          className="sidebar__menu__indicator"
          style={{
            display: activeIndex < 0 ? "none" : "block",
            transform: `translateX(-50%) translateY(${
              activeIndex * stepHeight
            }px)`,
          }}
        ></div>

        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index}>
            <div
              className={`sidebar__menu__item ${
                activeIndex === index ? "active" : ""
              }`}
            >
              <div className="sidebar__menu__item__icon">{item.icon}</div>
              <div className="sidebar__menu__item__text">{item.display}</div>
            </div>
          </Link>
        ))}

        <div
          onClick={logoutHandler}
          style={{ cursor: "pointer" }}
          className={`sidebar__menu__item`}
        >
          <div className="sidebar__menu__item__icon">
            <i class="bx bx-log-out"></i>
          </div>
          <div className="sidebar__menu__item__text">Logout</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
