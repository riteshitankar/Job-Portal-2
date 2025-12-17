import React, { useEffect, useState } from "react";
import { useCompany } from "../../../context/companyContext.jsx";
import { useMessage } from "../../../context/messageContext.jsx";
import { useNavigate } from "react-router-dom";
// import CompanyHeader from "../../includes/CompanyHeader.jsx";
// import CompanyFooter from "../../includes/CompanyFooter.jsx";
import Header from "../../sections/includes/Header.jsx";
import Footer from "../../sections/includes/Footer.jsx";
import CompanyProfile from "./CompanyProfile.jsx";

const CompanyDashboard = () => {
  const { company, fetchCompanyProfile, logout } = useCompany();
  const { triggerMessage } = useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      let token = localStorage.getItem("company_token");
      if (!token) throw "token not found !";
      await fetchCompanyProfile();
      triggerMessage("success", `welcome ${company.companyDetails?.name || "Company"} to dashboard !`);
    } catch (err) {
      console.log("cannot provide company dashboard access !", err);
      navigate("/company-login-register");
      triggerMessage("warning", "Please login first to access dashboard !");
    }
  };

  return (
    <>
      <Header />
      <div id="company-dashboard" className="p-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3>{company.companyDetails?.name}</h3>
            <p>{company.companyDetails?.industryType}</p>
            <p>{company.email?.userEmail}</p>
            <button onClick={() => { logout(); navigate("/company-login-register"); }} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </div>
          <div className="col-span-3">
            <CompanyProfile />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyDashboard;
