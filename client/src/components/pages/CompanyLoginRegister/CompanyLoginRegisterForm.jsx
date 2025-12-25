import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import {
  requestCompanyRegister,
  requestCompanyEmailOtpVerification,
  requestCompanyLogin
} from "../../../api/companyAPI.js";
import "./CompanyLoginRegisterForm.css"
import { useCompany } from "../../../context/companyContext.jsx";
import { useMessage } from "../../../context/messageContext.jsx";

const CompanyLoginRegisterForm = () => {
  let navigate = useNavigate();
  let { fetchCompanyProfile } = useCompany();
  let { triggerMessage } = useMessage();

  let [loading, setLoading] = useState(false);
  let [showOtpForm, setShowOtpForm] = useState(false);

  let [registerForm, setRegisterForm] = useState({
    companyDetails: {
      name: "",
      est_year: "",
      address: { street: "", city: "", state: "", country: "", pincode: "" },
      bio: "",
      website: "",
      industryType: "",
      founders: [],
      hrEmail: ""
    },
    contact_person: { name: "", phone: "", email: "", position: "" },
    email: "",
    phone: "",
    password: ""
  });

  let [registerFormVerifyOtp, setRegisterFormVerifyOtp] = useState({ email: "", companyOtp: "" });
  let [otp, setOtp] = useState(0);

  let [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const parts = name.split(".");
      setRegisterForm(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        let cur = copy;
        for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
        cur[parts[parts.length - 1]] = value;
        return copy;
      });
    } else {
      setRegisterForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let result = await requestCompanyRegister(registerForm);
      if (result.status != 202) throw "Unable to register company!";
      triggerMessage("success", result.data.message || "Company registered successfully!");
      setShowOtpForm(true);
      setRegisterFormVerifyOtp(prev => ({ ...prev, email: registerForm.email }));
    } catch (err) {
      triggerMessage("danger", err?.response?.data?.err || err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let result = await requestCompanyEmailOtpVerification({
        email: registerFormVerifyOtp.email,
        companyOtp: otp
      });
      if (result.status != 202) throw "OTP verification failed!";
      triggerMessage("success", result.data.message || "OTP verified!");
      setShowOtpForm(false);
    } catch (err) {
      triggerMessage("danger", err?.response?.data?.err || err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let result = await requestCompanyLogin(loginForm);
      if (result.status != 202) throw "Login failed!";
      localStorage.setItem("company_token", result.data.token);
      triggerMessage("success", result.data.message || "Login successful!");
      await fetchCompanyProfile();
      navigate("/company/dashboard");
    } catch (err) {
      triggerMessage("danger", err?.response?.data?.err || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8 space-y-10">

        {/* ================= OTP ================= */}
        {showOtpForm ? (
          <form onSubmit={handleOtpSubmit} className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Verify Company Email</h2>
            <p className="text-gray-600">
              OTP sent to <strong>{registerFormVerifyOtp.email}</strong>
            </p>

            <div className="flex justify-center">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                inputStyle={{
                  width: "3rem",
                  height: "3rem",
                  margin: "0 6px",
                  fontSize: "1.25rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  textAlign: "center",
                }}
                renderInput={(props) => <input {...props} />}
              />
            </div>

            <button className="w-full bg-primary text-white py-2 rounded font-semibold">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        ) : (

          /* ================= REGISTER ================= */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Register Company</h2>

            <input className="input" name="companyDetails.name" value={registerForm.companyDetails.name} onChange={handleRegisterChange} placeholder="Company Name" required />
            <input className="input" name="companyDetails.est_year" value={registerForm.companyDetails.est_year} onChange={handleRegisterChange} placeholder="Established Year" />
            <input className="input" name="companyDetails.hrEmail" value={registerForm.companyDetails.hrEmail} onChange={handleRegisterChange} placeholder="HR Email" />
            <input className="input" name="companyDetails.industryType" value={registerForm.companyDetails.industryType} onChange={handleRegisterChange} placeholder="Industry Type" />
            <input className="input" name="contact_person.name" value={registerForm.contact_person.name} onChange={handleRegisterChange} placeholder="Contact Person Name" />
            <input className="input" name="contact_person.email" value={registerForm.contact_person.email} onChange={handleRegisterChange} placeholder="Contact Person Email" />
            <input className="input" name="email" value={registerForm.email} onChange={handleRegisterChange} placeholder="Company Email" />
            <input className="input" name="phone" value={registerForm.phone} onChange={handleRegisterChange} placeholder="Phone" />
            <input className="input" type="password" name="password" value={registerForm.password} onChange={handleRegisterChange} placeholder="Password" />

            <button className="w-full bg-primary text-white py-2 rounded font-semibold">
              {loading ? "Processing..." : "Register Company"}
            </button>
          </form>
        )}

        {/* ================= LOGIN ================= */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-center mb-4">Company Login</h2>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input className="input" name="email" value={loginForm.email} onChange={(e) => setLoginForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" />
            <input className="input" type="password" name="password" value={loginForm.password} onChange={(e) => setLoginForm(p => ({ ...p, password: e.target.value }))} placeholder="Password" />
            <button className="w-full bg-black text-white py-2 rounded font-semibold">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CompanyLoginRegisterForm;
