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
                <div className="p-6 text-center">Loading job details...</div>
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
            triggerMessage("danger", err?.response?.data?.message || "Unable to apply");
        }
    };

    return (
        <>
            <Header />

            <div className="max-w-4xl mx-auto p-6 bg-white mt-6 shadow rounded">
                <h1 className="text-3xl font-bold mb-3">{title}</h1>

                {/* Company Logo */}
                {job.jobCreatedBy?.companyLogo && (
                    <img
                        src={`${import.meta.env.VITE_BASE_API_URL}/uploads/company_logos/${job.jobCreatedBy.companyLogo}`}
                        alt="company logo"
                        className="w-28 h-28 object-cover rounded mb-4"
                    />
                )}

                {/* Company Name */}
                <p className="text-gray-700 text-lg mb-2">
                    <strong>Company:</strong>{" "}
                    {job.jobCreatedBy?.companyDetails?.name || "Unknown"}
                </p>

                {/* Posted Date */}
                <p className="text-gray-600 mb-4">
                    <strong>Posted on:</strong>{" "}
                    {new Date(jobRequirements.postDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </p>

                <hr className="my-4" />

                <h2 className="text-xl font-semibold mb-2">Job Requirements</h2>

                <div className="space-y-2">
                    <p><strong>Job Type:</strong> {jobRequirements.type}</p>
                    <p><strong>Category:</strong> {jobRequirements.category}</p>
                    <p><strong>Experience:</strong> {jobRequirements.exprience}</p>
                    <p><strong>Location:</strong> {jobRequirements.location}</p>
                    <p><strong>Salary:</strong> ₹{jobRequirements.offeredSalary}</p>
                </div>

                <hr className="my-4" />

                <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                <p className="leading-relaxed text-gray-700">
                    {jobRequirements.description}
                </p>

                <hr className="my-4" />

                <p className="text-gray-700 mb-4">
                    <strong>Applicants:</strong> {job.applications?.length || 0}
                </p>

                {/* Apply button */}
                {/* Apply Button */}
                {job.closed ? (
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed"
                        disabled
                    >
                        Job Closed
                    </button>
                ) : hasApplied ? (
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                        disabled
                    >
                        Already Applied
                    </button>
                ) : job.applications.length >= job.maxApplications ? (
                    <button
                        className="bg-orange-500 text-white px-4 py-2 rounded cursor-not-allowed"
                        disabled
                    >
                        Application Limit Reached
                    </button>
                ) : (
                    <button
                        onClick={applyJob}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Apply Now
                    </button>
                )}



                <Link
                    to="/"
                    className="ml-3 bg-gray-700 text-white px-4 py-2 rounded inline-block"
                >
                    Back to Jobs
                </Link>
            </div>

            <Footer />
        </>
    );
};

export default JobDetailsPage;
