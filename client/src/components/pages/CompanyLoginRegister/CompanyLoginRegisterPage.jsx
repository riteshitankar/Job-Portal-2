import React from "react";
// import CompanyHeader from "../../includes/CompanyHeader.jsx";
// import CompanyFooter from "../../includes/CompanyFooter.jsx";
import Header from "../../sections/includes/Header.jsx";
import Footer from "../../sections/includes/Footer.jsx";
import CompanyLoginRegisterForm from "./CompanyLoginRegisterForm.jsx";

const CompanyLoginRegisterPage = () => {
  return (
    <>
      <Header />

      <div className="my-container my-5">
        <div className="card p-4">
          <CompanyLoginRegisterForm />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CompanyLoginRegisterPage;
