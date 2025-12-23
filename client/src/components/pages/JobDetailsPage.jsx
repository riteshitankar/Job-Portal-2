import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getAllJobsAPI } from "../../api/companyAPI";
import { applyForJob } from "../../api/userAPI";

import Header from "../sections/includes/Header";
import Footer from "../sections/includes/Footer";

import { useUser } from "../../context/userContext";
import { useMessage } from "../../context/messageContext";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const { user } = useUser();
  const { triggerMessage } = useMessage();

  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const res = await getAllJobsAPI();
      const allJobs = res.data.jobData || [];
      const found = allJobs.find(j => j._id === jobId);
      setJob(found);
    } catch (err) {
      console.log("job load error:", err);
    }
  };

  if (!job)
    return (
      <>
        <Header />
        <div className="p-6 text-center text-gray-600">
          Loading job details...
        </div>
        <Footer />
      </>
    );

  const { title, jobRequirements } = job;
  const hasApplied = job.applications?.includes(user?._id);

  const applyJob = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return triggerMessage("warning", "Please login to apply!");
    }

    try {
      const res = await applyForJob(token, job._id);

      if (res.status === 202) {
        triggerMessage("success", "Applied successfully!");
        setJob(prev => ({
          ...prev,
          applications: [...prev.applications, user._id]
        }));
      }
    } catch (err) {
      triggerMessage(
        "danger",
        err?.response?.data?.message || "Unable to apply"
      );
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-6 bg-white mt-6 shadow-lg rounded-xl">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-2">{title}</h1>

        {/* STATUS BADGE */}
        <div className="mb-4">
          {job.closed ? (
            <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
              Closed
            </span>
          ) : job.applications.length >= job.maxApplications ? (
            <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700">
              Application Limit Reached
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              Open
            </span>
          )}
        </div>

        {/* COMPANY LOGO */}
        {job.jobCreatedBy?.companyLogo && (
          <img
            src={`${import.meta.env.VITE_BASE_API_URL}/uploads/company_logos/${job.jobCreatedBy.companyLogo}`}
            alt="company logo"
            className="w-28 h-28 object-cover rounded mb-4 border"
          />
        )}

        {/* COMPANY INFO */}
        <div className="space-y-1 text-gray-700">
          <p>
            <strong>Company:</strong>{" "}
            {job.jobCreatedBy?.companyDetails?.name || "Unknown"}
          </p>

          <p className="text-gray-600">
            <strong>Posted on:</strong>{" "}
            {new Date(jobRequirements.postDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <hr className="my-6" />

        {/* JOB REQUIREMENTS */}
        <h2 className="text-xl font-semibold mb-3">Job Requirements</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
          <p><strong>Job Type:</strong> {jobRequirements.type}</p>
          <p><strong>Category:</strong> {jobRequirements.category}</p>
          <p><strong>Experience:</strong> {jobRequirements.exprience}</p>
          <p><strong>Location:</strong> {jobRequirements.location}</p>
          <p><strong>Salary:</strong> ₹{jobRequirements.offeredSalary}</p>
        </div>

        <hr className="my-6" />

        {/* DESCRIPTION */}
        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <p className="leading-relaxed text-gray-700">
          {jobRequirements.description}
        </p>

        <hr className="my-6" />

        {/* APPLICANTS INFO */}
        <div className="flex items-center gap-3 text-gray-700 mb-6">
          <strong>Applicants:</strong>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {job.applications?.length || 0} / {job.maxApplications}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">

          {job.closed ? (
            <button
              className="bg-red-500 text-white px-5 py-2 rounded cursor-not-allowed"
              disabled
            >
              Job Closed
            </button>
          ) : hasApplied ? (
            <button
              className="bg-gray-400 text-white px-5 py-2 rounded cursor-not-allowed"
              disabled
            >
              Already Applied
            </button>
          ) : job.applications.length >= job.maxApplications ? (
            <button
              className="bg-orange-500 text-white px-5 py-2 rounded cursor-not-allowed"
              disabled
            >
              Application Limit Reached
            </button>
          ) : (
            <button
              onClick={applyJob}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Apply Now
            </button>
          )}

          <Link
            to="/"
            className="bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800 transition"
          >
            Back to Jobs
          </Link>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default JobDetailsPage;
