import React from "react";
import { useCompany } from "../../context/companyContext.jsx";
import { useNavigate } from "react-router-dom";

const CompanyHeader = () => {
  const { company } = useCompany();
  const navigate = useNavigate();

  return (
    <header className="company-header bg-dark text-white p-4">
      <div className="container flex justify-between items-center">
        <div className="logo flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <span className="font-bold text-xl">COMPANY PORTAL</span>
        </div>

        <div className="right flex items-center gap-4">
          {company.loggedIn ? (
            <>
              <span>Welcome, <strong>{company.companyDetails?.name}</strong></span>
              <button onClick={() => { localStorage.removeItem("company_token"); window.location.href = "/company-login-register"; }} className="btn-logout">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate("/company-login-register")} className="btn-login">Login / Register</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;
