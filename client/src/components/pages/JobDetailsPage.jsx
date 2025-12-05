import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllJobsAPI } from "../../api/companyAPI";
import Header from "../sections/includes/Header";
import Footer from "../sections/includes/Footer";


import { applyForJob } from "../../api/userAPI";
import { useUser } from "../../context/userContext";
import { useMessage } from "../../context/messageContext";


const JobDetailsPage = () => {
    const { jobId } = useParams();
    const { triggerMessage } = useMessage();
    const { user } = useUser();
    const [job, setJob] = useState(null);


    useEffect(() => {
        fetchJobDetails();
    }, []);

    const fetchJobDetails = async () => {
        try {
            const res = await getAllJobsAPI();
            const allJobs = res.data.jobData || [];

            const foundJob = allJobs.find((j) => j._id === jobId);
            setJob(foundJob);
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

    const { title, jobRequirements, jobCreatedBy } = job;
    const hasApplied = job.applications?.includes(user?._id);



    const applyNow = async () => {
        const token = localStorage.getItem("token");  // <-- FIXED
        if (!token) return triggerMessage("warning", "Please login as a user first!");

        try {
            await applyForJob(token, job._id);
            setJob((prev) => ({
                ...prev,
                applications: [...prev.applications, user._id]
            }));

            triggerMessage("success", "Applied Successfully!");
        } catch (err) {
            triggerMessage("danger", err?.response?.data?.message || "Failed to apply");
        }
    };

    return (
        <>
            <Header />

            <div className="max-w-4xl mx-auto p-6 bg-white mt-6 shadow rounded">
                <h1 className="text-3xl font-bold mb-3">{title}</h1>

                {job.jobCreatedBy?.companyLogo && (
                    <img
                        src={`${import.meta.env.VITE_BASE_API_URL}/uploads/company_logos/${job.jobCreatedBy.companyLogo}`}
                        alt="company logo"
                        className="w-28 h-28 object-cover rounded mb-4"
                    />
                )}


                {/* Company Name */}
                <p className="text-gray-700 text-lg mb-2">
                    <strong>Company:</strong> {job.jobCreatedBy?.companyDetails?.name}
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
                    <p>
                        <strong>Job Type:</strong> {jobRequirements.type}
                    </p>
                    <p>
                        <strong>Category:</strong> {jobRequirements.category}
                    </p>
                    <p>
                        <strong>Experience:</strong> {jobRequirements.exprience}
                    </p>
                    <p>
                        <strong>Location:</strong> {jobRequirements.location}
                    </p>
                    <p>
                        <strong>Salary Offered:</strong> ₹{jobRequirements.offeredSalary}
                    </p>
                </div>

                <hr className="my-4" />

                <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                <p className="leading-relaxed text-gray-700">
                    {jobRequirements.description}
                </p>

                <hr className="my-4" />

                <div className="job-description mb-6">
                    <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                    <p>{job.jobRequirements.description}</p>
                </div>

                <button
                    onClick={applyNow}
                    disabled={hasApplied}
                    className={`px-4 py-2 rounded mt-4 text-white 
    ${hasApplied ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                    {hasApplied ? "Already Applied" : "Apply Now"}
                </button>



                <Link
                    to="/"
                    className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
                >
                    Back to Jobs
                </Link>
            </div>

            <Footer />
        </>
    );
};

export default JobDetailsPage;
