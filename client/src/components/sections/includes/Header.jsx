import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/userContext.jsx";
import { useCompany } from "../../../context/companyContext.jsx";

const Header = () => {
  const navigate = useNavigate();

  const { user, logout: userLogout } = useUser();
  const { company, logout: companyLogout } = useCompany();

  const isUserLoggedIn = !!localStorage.getItem("token");
  const isCompanyLoggedIn = !!localStorage.getItem("company_token");

  const handleLogoutUser = () => {
    if (isUserLoggedIn) {
      userLogout();
      navigate("/user-login-register");
    }
  };
  const handleLogoutCompany = () => {
    if (isCompanyLoggedIn) {
      companyLogout();
      navigate("/company-login-register");
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Job<span className="text-black">Portal</span>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-6">

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
              <Link to="/user/dashboard" className="font-semibold">
                UserDB
              </Link>
              <span className="font-semibold">
                Hi, {user?.name}
              </span>
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
              <Link to="/company/dashboard" className="font-semibold">
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
      </div>
    </header>
  );
};

export default Header;
