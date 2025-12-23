import React, { useEffect } from "react";
import { useCompany } from "../../../context/companyContext.jsx";
import { useMessage } from "../../../context/messageContext.jsx";
import { useNavigate } from "react-router-dom";

import Header from "../../sections/includes/Header.jsx";
import Footer from "../../sections/includes/Footer.jsx";
import CompanyProfile from "./CompanyProfile.jsx";

import { FaBuilding, FaIndustry, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

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
      if (!token) throw "token not found!";
      await fetchCompanyProfile();
      triggerMessage(
        "success",
        `Welcome ${company.companyDetails?.name || "Company"} 👋`
      );
    } catch (err) {
      console.log("company dashboard access denied", err);
      navigate("/company-login-register");
      triggerMessage("warning", "Please login to access dashboard!");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">

            {/* Company Badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                <FaBuilding />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {company.companyDetails?.name || "Company"}
                </h3>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                  Company Account
                </span>
              </div>
            </div>

            <hr />

            {/* Company Info */}
            <div className="text-sm text-gray-700 space-y-2">
              <p className="flex items-center gap-2">
                <FaIndustry className="text-gray-500" />
                {company.companyDetails?.industryType || "Industry"}
              </p>
              <p className="flex items-center gap-2 break-all">
                <FaEnvelope className="text-gray-500" />
                {company.email?.userEmail}
              </p>
            </div>

            <hr />

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate("/company-login-register");
              }}
              className="mb-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">
            <CompanyProfile />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CompanyDashboard;
