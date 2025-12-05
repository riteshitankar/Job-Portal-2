import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCompany } from "../../../context/companyContext.jsx";
import { useMessage } from "../../../context/messageContext.jsx";
import { companyUploadFile, uploadCompanyDocument, deleteCompanyDocument, updateCompanyBio } from "../../../api/companyAPI.js";
import CompanyPostJobForm from "./CompanyPostJobForm.jsx";

const CompanyProfile = () => {
  const { company, fetchCompanyProfile } = useCompany();
  const { triggerMessage } = useMessage();

  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [showBioPopup, setShowBioPopup] = useState(false);
  const [bioValue, setBioValue] = useState(company.companyDetails?.bio || "");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleUploadLogo = async () => {
    if (!selectedLogo) return triggerMessage("warning", "No logo selected");
    const fd = new FormData();
    fd.append("file", selectedLogo);
    try {
      await companyUploadFile(localStorage.getItem("company_token"), "company_logo", fd);
      triggerMessage("success", "Company logo uploaded");
      setLogoPreview(null);
      setSelectedLogo(null);
      await fetchCompanyProfile();
    } catch (err) {
      triggerMessage("danger", "Upload failed");
    }
  };

  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      await uploadCompanyDocument(localStorage.getItem("company_token"), fd);
      triggerMessage("success", "Document uploaded");
      await fetchCompanyProfile();
    } catch (err) {
      triggerMessage("danger", "Document upload failed");
    }
  };

  const handleDeleteDocument = async (filename) => {
    if (!confirm("Are you sure to delete this document?")) return;
    try {
      await deleteCompanyDocument(localStorage.getItem("company_token"), filename);
      triggerMessage("success", "Document deleted");
      await fetchCompanyProfile();
    } catch (err) {
      triggerMessage("danger", "Delete failed");
    }
  };

  const saveBio = async () => {
    const textOnly = bioValue.replace(/<[^>]*>/g, "").trim();
    if (textOnly.length < 5) return triggerMessage("warning", "Bio must be at least 5 characters!");
    try {
      await updateCompanyBio(localStorage.getItem("company_token"), bioValue);
      triggerMessage("success", "Bio updated");
      setShowBioPopup(false);
      fetchCompanyProfile();
    } catch (err) {
      triggerMessage("danger", "Failed to save bio");
    }
  };

  return (
    <div className="company-profile bg-white p-6 rounded shadow">
      <div className="flex gap-6">
        <div>
          {company.companyLogo ? (
            <img src={`${import.meta.env.VITE_BASE_API_URL}/uploads/company_logos/${company.companyLogo}`} alt="logo" className="w-40 h-40 object-cover rounded" />
          ) : (
            <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">No Logo</div>
          )}
          <div className="mt-2">
            <label className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
              Change Logo
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
            </label>
            {selectedLogo && <button onClick={handleUploadLogo} className="ml-2 bg-green-500 text-white px-3 py-1 rounded">Upload</button>}
          </div>
        </div>

        <div className="flex-1">
          <h2>{company.companyDetails?.name}</h2>
          <p>Industry: {company.companyDetails?.industryType}</p>
          <p>HR Email: {company.companyDetails?.hrEmail}</p>
          <div className="mt-4">
            <h4>Bio</h4>
            {company.companyDetails?.bio ? (
              <div dangerouslySetInnerHTML={{ __html: company.companyDetails.bio }} />
            ) : (
              <div className="italic">[No bio]</div>
            )}
            <button onClick={() => { setBioValue(company.companyDetails?.bio || ""); setShowBioPopup(true); }} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Edit Bio</button>
          </div>

          <div className="mt-4">
            <h4>Documents</h4>
            <div className="flex gap-2 items-center">
              <label className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Upload Document
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="hidden" onChange={handleUploadDocument} />
              </label>
            </div>
            <ul className="mt-2">
              {company.documents && company.documents.length > 0 ? company.documents.map((d) => (
                <li key={d} className="flex items-center gap-3">
                  <a href={`${import.meta.env.VITE_BASE_API_URL}/uploads/company_documents/${d}`} target="_blank">{d}</a>
                  <button onClick={() => handleDeleteDocument(d)} className="text-red-500">Delete</button>
                </li>
              )) : <li>No documents uploaded</li>}
            </ul>
            {/* POST A JOB SECTION */}
            <div className="mt-6">
              <h3 className="font-semibold">Job Management</h3>
              <div style={{backgroundColor:'red'}}>
              <CompanyPostJobForm />
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Bio popup */}
      {showBioPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded w-full max-w-2xl">
            <h3>Edit Bio</h3>
            <ReactQuill value={bioValue} onChange={setBioValue} />
            <div className="flex gap-2 mt-4">
              <button onClick={saveBio} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              <button onClick={() => setShowBioPopup(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
