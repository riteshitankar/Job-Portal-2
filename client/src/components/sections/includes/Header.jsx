import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/userContext.jsx";
import { useCompany } from "../../../context/companyContext.jsx";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout: userLogout } = useUser();
  const { company, logout: companyLogout } = useCompany();

  const isUserLoggedIn = !!localStorage.getItem("token");
  const isCompanyLoggedIn = !!localStorage.getItem("company_token");

  const handleLogoutUser = () => {
    userLogout();
    navigate("/user-login-register");
    setMenuOpen(false);
  };

  const handleLogoutCompany = () => {
    companyLogout();
    navigate("/company-login-register");
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50" >
      <div className="container mx-auto flex justify-between items-center px-6 py-4 ">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Job<span className="text-black">Portal</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">

          {/* Guest */}
          {!isUserLoggedIn && !isCompanyLoggedIn && (
            <>
              <Link to="/user-login-register" className="font-semibold">
                User Login
              </Link>
              <Link to="/company-login-register" className="font-semibold">
                Company Login
              </Link>
            </>
          )}

          {/* User */}
          {isUserLoggedIn && (
            <>
              {/* <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                USER
              </span> */}
              <Link to="/user/dashboard" className="font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700">
                UserDB
              </Link>
              <span className="font-semibold"> {user?.name}</span>
              <button
                onClick={handleLogoutUser}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}

          {/* Company */}
          {isCompanyLoggedIn && (
            <>
              {/* <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                COMPANY
              </span> */}
              <Link to="/company/dashboard" className="font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700">
                CompanyDB
              </Link>
              <span className="font-semibold">
                {company?.companyDetails?.name}
              </span>
              <button
                onClick={handleLogoutCompany}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow px-6 py-4 space-y-4">

          {!isUserLoggedIn && !isCompanyLoggedIn && (
            <>
              <Link onClick={() => setMenuOpen(false)} to="/user-login-register">
                User Login
              </Link>
              <Link onClick={() => setMenuOpen(false)} to="/company-login-register">
                Company Login
              </Link>
            </>
          )}

          {isUserLoggedIn && (
            <>
              {/* <span className="block text-sm text-blue-700 font-bold">
                USER
              </span> */}
              <Link className="font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700" onClick={() => setMenuOpen(false)} to="/user/dashboard">
                UserDB
              </Link>
              <button
                onClick={handleLogoutUser}
                className="block text-red-600 font-semibold"
              >
                Logout
              </button>
            </>
          )}

          {isCompanyLoggedIn && (
            <>
              {/* <span className="block text-sm text-purple-700 font-bold">
                COMPANY
              </span> */}
              <Link className="font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700" onClick={() => setMenuOpen(false)} to="/company/dashboard">
                CompanyDB
              </Link>
              <button
                onClick={handleLogoutCompany}
                className="block text-red-600 font-semibold"
              >
                Logout
              </button>
            </>
          )}

        </div>
      )}
    </header>
  );
};

export default Header;
