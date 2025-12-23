import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";

import { useCompany } from "../../../context/companyContext.jsx";
import { useMessage } from "../../../context/messageContext.jsx";

import {
  companyUploadFile,
  uploadCompanyDocument,
  deleteCompanyDocument,
  updateCompanyBio
} from "../../../api/companyAPI.js";

import CompanyPostJobForm from "./CompanyPostJobForm.jsx";
import CompanyJobList from "./CompanyJobList.jsx";

const CompanyProfile = () => {
  const { company, fetchCompanyProfile } = useCompany();
  const { triggerMessage } = useMessage();

  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showBioPopup, setShowBioPopup] = useState(false);
  const [bioValue, setBioValue] = useState(company.companyDetails?.bio || "");
  const [jobRefresh, setJobRefresh] = useState(0);

  /* ================= DROPZONE ================= */

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setSelectedLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop,
  });

  const handleUploadLogo = async () => {
    if (!selectedLogo) return triggerMessage("warning", "No logo selected");

    const fd = new FormData();
    fd.append("file", selectedLogo);

    try {
      await companyUploadFile(
        localStorage.getItem("company_token"),
        "company_logo",
        fd
      );
      triggerMessage("success", "Company logo uploaded");
      setSelectedLogo(null);
      setLogoPreview(null);
      await fetchCompanyProfile();
    } catch {
      triggerMessage("danger", "Upload failed");
    }
  };

  /* ================= DOCUMENTS ================= */

  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      await uploadCompanyDocument(localStorage.getItem("company_token"), fd);
      triggerMessage("success", "Document uploaded");
      await fetchCompanyProfile();
    } catch {
      triggerMessage("danger", "Document upload failed");
    }
  };

  const handleDeleteDocument = async (filename) => {
    if (!confirm("Delete this document?")) return;
    try {
      await deleteCompanyDocument(
        localStorage.getItem("company_token"),
        filename
      );
      triggerMessage("success", "Document deleted");
      await fetchCompanyProfile();
    } catch {
      triggerMessage("danger", "Delete failed");
    }
  };

  /* ================= BIO ================= */

  const saveBio = async () => {
    const textOnly = bioValue.replace(/<[^>]*>/g, "").trim();
    if (textOnly.length < 5)
      return triggerMessage("warning", "Bio too short!");

    try {
      await updateCompanyBio(
        localStorage.getItem("company_token"),
        bioValue
      );
      triggerMessage("success", "Bio updated");
      setShowBioPopup(false);
      fetchCompanyProfile();
    } catch {
      triggerMessage("danger", "Bio update failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-xl shadow space-y-10"
    >

      {/* ================= HEADER ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LOGO */}
        <div className="space-y-4 text-center">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            `}
          >
            <input {...getInputProps()} />
            {logoPreview || company.companyLogo ? (
              <img
                src={
                  logoPreview ||
                  `${import.meta.env.VITE_BASE_API_URL}/uploads/company_logos/${company.companyLogo}`
                }
                className="w-40 h-40 object-cover mx-auto rounded-lg"
              />
            ) : (
              <p className="text-gray-500">
                Drag & drop logo here or click
              </p>
            )}
          </div>

          {selectedLogo && (
            <button
              onClick={handleUploadLogo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Upload Logo
            </button>
          )}
        </div>

        {/* COMPANY INFO */}
        <div className="md:col-span-2 space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            {company.companyDetails?.name}
          </h1>
          <p className="text-gray-600">
            <strong>Industry:</strong>{" "}
            {company.companyDetails?.industryType}
          </p>
          <p className="text-gray-600">
            <strong>HR Email:</strong>{" "}
            {company.companyDetails?.hrEmail}
          </p>
        </div>
      </div>

      {/* ================= BIO ================= */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">About Company</h2>

        {company.companyDetails?.bio ? (
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: company.companyDetails.bio }}
          />
        ) : (
          <p className="italic text-gray-400">No bio added.</p>
        )}

        <button
          onClick={() => {
            setBioValue(company.companyDetails?.bio || "");
            setShowBioPopup(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Edit Bio
        </button>
      </section>

      {/* ================= DOCUMENTS ================= */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Documents</h2>

        <label className="inline-block bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer">
          Upload Document
          <input
            type="file"
            className="hidden"
            onChange={handleUploadDocument}
          />
        </label>

        <div className="grid gap-2">
          {company.documents?.length ? (
            company.documents.map((doc) => (
              <motion.div
                key={doc}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center bg-gray-50 p-3 rounded"
              >
                <a
                  href={`${import.meta.env.VITE_BASE_API_URL}/uploads/company_documents/${doc}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {doc}
                </a>
                <button
                  onClick={() => handleDeleteDocument(doc)}
                  className="text-red-500 font-semibold"
                >
                  Delete
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">No documents uploaded</p>
          )}
        </div>
      </section>

      {/* ================= JOB MANAGEMENT ================= */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Job Management</h2>

        <CompanyPostJobForm
          onPosted={() => setJobRefresh((v) => v + 1)}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CompanyJobList refresh={jobRefresh} />
        </motion.div>
      </section>

      {/* ================= BIO MODAL ================= */}
      {showBioPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl w-full max-w-2xl space-y-4"
          >
            <h3 className="text-xl font-semibold">Edit Bio</h3>
            <ReactQuill value={bioValue} onChange={setBioValue} />
            <div className="flex justify-end gap-3">
              <button
                onClick={saveBio}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowBioPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyProfile;
