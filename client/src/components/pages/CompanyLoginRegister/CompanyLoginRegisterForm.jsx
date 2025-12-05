import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import {
    requestCompanyRegister,
    requestCompanyEmailOtpVerification,
    requestCompanyLogin
} from "../../../api/companyAPI.js";

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
        // support nested fields by name using dot notation (e.g., "companyDetails.name")
        if (name.includes(".")) {
            const parts = name.split(".");
            setRegisterForm(prev => {
                const copy = JSON.parse(JSON.stringify(prev));
                let cur = copy;
                for (let i = 0; i < parts.length - 1; i++) {
                    cur = cur[parts[i]];
                }
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
            // prepare payload: flatten email to top-level to match backend expectation
            const payload = {
                companyDetails: registerForm.companyDetails,
                contact_person: registerForm.contact_person,
                email: registerForm.email,
                phone: registerForm.phone,
                password: registerForm.password
            };
            let result = await requestCompanyRegister(payload);
            if (result.status != 202) throw "unable to register company !";
            triggerMessage("success", result.data.message || "Registered company successfully !");
            setShowOtpForm(true);
            setRegisterFormVerifyOtp(prev => ({ ...prev, email: registerForm.email }));
            setRegisterForm({
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
        } catch (err) {
            console.log("company register error : ", err);
            triggerMessage("danger", err?.response?.data?.err || err?.message || err);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // set OTP
            setRegisterFormVerifyOtp(prev => ({ ...prev, companyOtp: otp }));
            let result = await requestCompanyEmailOtpVerification({ email: registerFormVerifyOtp.email, companyOtp: otp });
            if (result.status != 202) throw "unable to verify OTP !";
            triggerMessage("success", result.data.message || "OTP verified successfully !");
            setShowOtpForm(false);
            setRegisterFormVerifyOtp({ email: "", companyOtp: "" });
        } catch (err) {
            console.log("verify otp error : ", err);
            triggerMessage("danger", err?.response?.data?.err || err?.message || err);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let result = await requestCompanyLogin(loginForm);
            if (result.status != 202) throw "Login Failed !";
            localStorage.setItem("company_token", result.data.token);
            triggerMessage("success", result.data.message || "Login successful!");
            await fetchCompanyProfile();
            navigate("/company/dashboard");
        } catch (err) {
            console.log("company login failed : ", err);
            triggerMessage("danger", err?.response?.data?.err || err?.message || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="company-auth">
            <div className="card">
                {showOtpForm ? (
                    <form onSubmit={handleOtpSubmit}>
                        <h2>Verify Company Email</h2>
                        <p>An OTP has been sent to {registerFormVerifyOtp.email}</p>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={4}
                            inputStyle={{
                                width: "3rem",
                                height: "3rem",
                                margin: "0 4px",
                                fontSize: "1.5rem",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                textAlign: "center",
                            }}
                            renderInput={(props) => <input {...props} />}
                        />

                        <button type="submit" disabled={loading}>{loading ? "Processing..." : "Verify OTP"}</button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit}>
                        <h2>Register Company</h2>

                        <input name="companyDetails.name" value={registerForm.companyDetails.name} onChange={handleRegisterChange} placeholder="Company Name" required />
                        <input name="companyDetails.est_year" value={registerForm.companyDetails.est_year} onChange={handleRegisterChange} placeholder="Established Year" required />
                        <input name="companyDetails.hrEmail" value={registerForm.companyDetails.hrEmail} onChange={handleRegisterChange} placeholder="HR Email" type="email" required />
                        <input name="companyDetails.industryType" value={registerForm.companyDetails.industryType} onChange={handleRegisterChange} placeholder="Industry Type" required />
                        <input name="contact_person.name" value={registerForm.contact_person.name} onChange={handleRegisterChange} placeholder="Contact Person Name" required />
                        <input name="contact_person.email" value={registerForm.contact_person.email} onChange={handleRegisterChange} placeholder="Contact Person Email" type="email" required />
                        <input name="email" value={registerForm.email} onChange={handleRegisterChange} placeholder="Company Email" type="email" required />
                        <input name="phone" value={registerForm.phone} onChange={handleRegisterChange} placeholder="Phone" required />
                        <input name="password" value={registerForm.password} onChange={handleRegisterChange} placeholder="Password" type="password" required />

                        <button type="submit" disabled={loading}>{loading ? "Processing..." : "Register Company"}</button>
                        <hr />
                        <button type="button" onClick={() => setShowOtpForm(false)}>Have OTP? Verify</button>
                    </form>
                )}

                <div>
                    <h2>Company Login</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <input name="email" value={loginForm.email} onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" required />
                        <input name="password" value={loginForm.password} onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))} placeholder="Password" type="password" required />
                        <button type="submit" disabled={loading}>{loading ? "Processing..." : "Login"}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanyLoginRegisterForm;
