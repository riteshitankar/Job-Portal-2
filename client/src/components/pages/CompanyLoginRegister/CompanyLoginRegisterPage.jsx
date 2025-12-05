import React from "react";
import CompanyHeader from "../../includes/CompanyHeader.jsx";
import CompanyFooter from "../../includes/CompanyFooter.jsx";
import CompanyLoginRegisterForm from "./CompanyLoginRegisterForm.jsx";

const CompanyLoginRegisterPage = () => {
  return (
    <>
      <CompanyHeader />

      <div className="my-container my-5">
        <div className="card p-4">
          <CompanyLoginRegisterForm />
        </div>
      </div>

      <CompanyFooter />
    </>
  );
};

export default CompanyLoginRegisterPage;
