import { useState, useEffect, createContext, useContext } from "react";
import { requestCompanyProfile } from "../api/companyAPI.js";

const companyContext = createContext();

let CompanyProvider = ({ children }) => {
  let [company, setCompany] = useState({ loggedIn: false });

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      let token = localStorage.getItem("company_token");
      if (!token) throw "token not found !";
      let result = await requestCompanyProfile(token);
      if (result.status != 200) throw "unable to fetch company profile !";
      setCompany(prev => ({ ...result.data.companyData, loggedIn: true }));
    } catch (err) {
      console.log("company profile fetching error : ", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("company_token");
    setCompany({ loggedIn: false });
  };

  return (
    <companyContext.Provider value={{ company, fetchCompanyProfile, logout }}>
      {children}
    </companyContext.Provider>
  );
};

const useCompany = () => useContext(companyContext);

export { CompanyProvider, useCompany };
