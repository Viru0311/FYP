import { useEffect, useRef, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { SERVER_BASE_URL } from "../../config/config";
import "./sidebar.scss";
import { UserContext } from "../../context/user_context";

const logoutHandler = () => {
  axios
    .get(`${SERVER_BASE_URL}/api/auth/logout`,{withCredentials:true})
    .then((res) => {
      window.location = "/";
    })
    .catch((err) => {
      window.location = "/";
    });
};

const sidebarNavItems = [
  // {
  //   display: "Dashboard",
  //   icon: <i className="bx bx-home"></i>,
  //   to: "/",
  //   section: "",
  // },
];

const patientSidebarItems = [
  {
    display: "Diagnose",
    icon: <i className="bx bxs-virus bx-flip-horizontal"></i>,
    to: "/patient/diagnose",
    section: "patient/diagnose",
  },
  {
    display: "Results",
    icon: <i className="bx bx-plus-medical"></i>,
    to: "/patient/results",
    section: "patient/results",
  },
  {
    display: "Connect to Doctor",
    icon: <i className="bx bx-phone-call"></i>,
    to: "/patient/connect_with_doctor",
    section: "patient/connect_with_doctor",
  },
];

const doctorSidebarItems = [
  {
    display: "Diagnose",
    icon: <i className="bx bxs-virus bx-flip-horizontal"></i>,
    to: "/doctor/diagnose",
    section: "doctor/diagnose",
  },
  // {
  //   display: "Consultation",
  //   icon: <i className="bx bx-donate-heart"></i>,
  //   to: "/doctor/consultation",
  //   section: "doctor/consultation",
  // },
];

const getUpdatedSidebarItems = (value) => {
  let finalSidebarItems = [
    ...sidebarNavItems,
    {
      display: "SignIn",
      icon: <i className="bx bx-log-in"></i>,
      to: "/signin",
      section: "signin",
      requireLoggedOut: true,
    },
  ];

  if (value.loggedIn) {
    if (value.user.userType === "patient")
      finalSidebarItems = [...sidebarNavItems, ...patientSidebarItems];
    else finalSidebarItems = [...sidebarNavItems, ...doctorSidebarItems];
  }
  return finalSidebarItems;
};

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const sidebarRef = useRef();
  const indicatorRef = useRef();
  const location = useLocation();
  const value = useContext(UserContext);
  let finalSidebarItems = getUpdatedSidebarItems(value);

  useEffect(() => {
    finalSidebarItems = getUpdatedSidebarItems(value);
  }, [value]);

  useEffect(
    () => {
      setTimeout(() => {
        const sidebarItem = sidebarRef.current.querySelector(
          ".sidebar__menu__item"
        );
        indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
        setStepHeight(sidebarItem.clientHeight);
      }, 50);
    },
    [],
    [value]
  );

  // change active index
  useEffect(() => {
    const str = window.location.pathname;
    const curPath = str.substring(str.indexOf("-") + 2) || "";
    const activeItem = finalSidebarItems.findIndex((item) => {
      return item.section === curPath;
    });
    setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);

  return (
    <UserContext.Consumer>
      {({ user, loggedIn, updateUser, updateLogInStatus }) => (
        <div className="sidebar">
          <center>
            <img src="/wc.jpeg" style={{height:'200px',width:'200px',marginTop:'20px'}}></img>
            <div className="sidebar__logo">WellConnect</div>
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

            {finalSidebarItems.map((item, index) => {
              if (!item.requireLoggedOut || !loggedIn) {
                return (
                  <Link to={item.to} key={index}>
                    <div
                      className={`sidebar__menu__item ${
                        activeIndex === index ? "active" : ""
                      }`}
                    >
                      <div className="sidebar__menu__item__icon">
                        {item.icon}
                      </div>
                      <div className="sidebar__menu__item__text">
                        {item.display}
                      </div>
                    </div>
                  </Link>
                );
              }
            })}

            {loggedIn ? (
              <>
                {/* {user.userType === "patient" ? ():()} */}

                <div
                  onClick={logoutHandler}
                  style={{ cursor: "pointer" }}
                  className={`sidebar__menu__item`}
                >
                  <div className="sidebar__menu__item__icon">
                    <i className="bx bx-log-out"></i>
                  </div>
                  <div className="sidebar__menu__item__text">Logout</div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </UserContext.Consumer>
  );
};

export default Sidebar;
