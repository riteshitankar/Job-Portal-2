import React, { useEffect, useState } from "react";
import { getCompanyJobs, deleteCompanyJob, closeCompanyJob } from "../../../api/companyAPI.js";
import { useMessage } from "../../../context/messageContext.jsx";
import CompanyPostJobForm from "./CompanyPostJobForm.jsx";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CompanyJobList = ({ refresh = 0 }) => {
    const [jobs, setJobs] = useState([]);
    const [editJob, setEditJob] = useState(null);
    const { triggerMessage } = useMessage();
    const navigate = useNavigate();

    const token = localStorage.getItem("company_token");

    const loadJobs = async () => {
        try {
            const res = await getCompanyJobs(token);
            if (res.status === 200) {
                setJobs(res.data.jobs);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadJobs();
    }, [refresh]);

    /* ================= ACTIONS ================= */

    const handleDelete = async (jobId) => {
        if (!confirm("Delete this job permanently?")) return;

        try {
            const res = await deleteCompanyJob(token, jobId);
            if (res.status === 202) {
                triggerMessage("success", "Job deleted");
                loadJobs();
            }
        } catch {
            triggerMessage("danger", "Delete failed");
        }
    };

    const handleCloseJob = async (jobId) => {
        if (!confirm("Close this job?")) return;

        try {
            const res = await closeCompanyJob(token, jobId);
            if (res.status === 202) {
                triggerMessage("success", "Job closed");
                loadJobs();
            }
        } catch {
            triggerMessage("danger", "Unable to close job");
        }
    };

    return (
        <div className="mt-10 bg-white p-6 rounded-xl shadow space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">My Posted Jobs</h3>

            {/* EDIT FORM */}
            {editJob && (
                <CompanyPostJobForm
                    editJobData={editJob}
                    onEdited={() => {
                        setEditJob(null);
                        loadJobs();
                    }}
                />
            )}

            {/* EMPTY STATE */}
            {jobs.length === 0 ? (
                <div className="text-gray-500 italic">
                    No jobs posted yet.
                </div>
            ) : (
                <div className="grid gap-5">
                    {jobs.map((job, index) => {
                        const jr = job.jobRequirements;

                        return (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-gray-50"
                            >
                                <div className="flex flex-col lg:flex-row justify-between gap-6">

                                    {/* LEFT — DETAILS */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-xl font-semibold text-gray-800">
                                                {job.title}
                                            </h4>

                                            {/* STATUS BADGE */}
                                            {job.closed ? (
                                                <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full">
                                                    Closed
                                                </span>
                                            ) : job.applications.length >= job.maxApplications ? (
                                                <span className="px-2 py-1 text-sm bg-orange-100 text-orange-700 rounded font-semibold">
                                                    Application Limit Reached
                                                </span>
                                            )
                                                : (
                                                    <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-600 rounded-full">
                                                        Open
                                                    </span>
                                                )}
                                        </div>

                                        <p className="text-gray-600">
                                            {jr.category} • {jr.type} • {jr.exprience}
                                        </p>

                                        <p className="text-gray-600">
                                            {jr.location}
                                        </p>

                                        <p className="text-gray-800 font-semibold">
                                            ₹ {jr.offeredSalary}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Posted on{" "}
                                            {new Date(jr.postDate).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>

                                        {/* APPLICANTS COUNT */}
                                        <div className="inline-block mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
                                            Applicants: {job.applications?.length || 0}
                                        </div>
                                    </div>

                                    {/* RIGHT — ACTIONS */}
                                    <div className="flex flex-wrap lg:flex-col gap-2 items-start lg:items-end">

                                        {!job.closed && (
                                            <button
                                                onClick={() => handleCloseJob(job._id)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded"
                                            >
                                                Close Job
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setEditJob(job)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded"
                                        >
                                            Delete
                                        </button>

                                        <button
                                            onClick={() => navigate(`/company/applicants/${job._id}`)}
                                            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 rounded"
                                        >
                                            Applicants
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CompanyJobList;
