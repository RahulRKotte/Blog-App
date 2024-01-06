import React, { useContext } from "react";
import Logo from "../images/logo.png";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const currentCategory = new URLSearchParams(location.search).get("cat");
  const currentId = new URLSearchParams(location.search).get("uid");

  const activeLinkStyle = {
    backgroundColor: "teal",
    color: "white",
    padding: "2px 5px",
    borderRadius: "3px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const loginLinkStyle = {
    backgroundColor: "#F44900",
    color: "white",
    padding: "2px 5px",
    borderRadius: "3px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const postLinkDestination = currentUser ? "/write" : "/login";

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="logo" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/?cat=art">
            <h6 style={currentCategory === "art" ? activeLinkStyle : {}}>
              ART
            </h6>
          </Link>
          <Link className="link" to="/?cat=science">
            <h6 style={currentCategory === "science" ? activeLinkStyle : {}}>
              SCIENCE
            </h6>
          </Link>
          <Link className="link" to="/?cat=technology">
            <h6 style={currentCategory === "technology" ? activeLinkStyle : {}}>
              TECHNOLOGY
            </h6>
          </Link>
          <Link className="link" to="/?cat=cinema">
            <h6 style={currentCategory === "cinema" ? activeLinkStyle : {}}>
              CINEMA
            </h6>
          </Link>
          <Link className="link" to="/?cat=design">
            <h6 style={currentCategory === "design" ? activeLinkStyle : {}}>
              DESIGN
            </h6>
          </Link>
          <Link className="link" to="/?cat=food">
            <h6 style={currentCategory === "food" ? activeLinkStyle : {}}>
              FOOD
            </h6>
          </Link>
          {currentUser && (
            <Link className="link" to={`/?uid=${currentUser.id}`}>
              <span style={currentId ? loginLinkStyle : {}}>
                {currentUser.username}
              </span>
            </Link>
          )}

          {currentUser ? (
            <>
              <span onClick={logout}>Logout</span>
              <span className="write">
                <Link className="link" to={postLinkDestination}>
                  <h6
                    style={currentCategory === "write" ? activeLinkStyle : {}}
                  >
                    Post
                  </h6>
                </Link>
              </span>
            </>
          ) : (
            <Link className="link" to={postLinkDestination}>
              <h6
                style={
                  currentCategory === "write" ? activeLinkStyle : loginLinkStyle
                }
              >
                Post
              </h6>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
