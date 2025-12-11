import React, { useEffect, useState } from "react";
import { getCompanyJobs, deleteCompanyJob, closeCompanyJob } from "../../../api/companyAPI.js";
import { useMessage } from "../../../context/messageContext.jsx";
import CompanyPostJobForm from "./CompanyPostJobForm.jsx";
import { useNavigate } from "react-router-dom";

const CompanyJobList = ({ refresh = 0 }) => {
    const [jobs, setJobs] = useState([]);
    const { triggerMessage } = useMessage();
    const [editJob, setEditJob] = useState(null);
    const navigate = useNavigate();


    const token = localStorage.getItem("company_token");

    const loadJobs = async () => {
        try {
            let res = await getCompanyJobs(token);
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

    // DELETE JOB
    const handleDelete = async (jobId) => {
        if (!confirm("Delete this job permanently?")) return;

        try {
            let res = await deleteCompanyJob(token, jobId);
            if (res.status === 202) {
                triggerMessage("success", "Job deleted");
                loadJobs();
            }
        } catch (err) {
            triggerMessage("danger", "Delete failed");
        }
    };

    // CLOSE JOB
    const handleCloseJob = async (jobId) => {
        if (!confirm("Close this job? Users will not be able to apply.")) return;

        try {
            const res = await closeCompanyJob(token, jobId);
            if (res.status === 202) {
                triggerMessage("success", "Job closed successfully");
                loadJobs();
            }
        } catch (err) {
            triggerMessage("danger", "Unable to close job");
        }
    };

    return (
        <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-3">My Posted Jobs</h3>

            {editJob && (
                <CompanyPostJobForm
                    editJobData={editJob}
                    onEdited={() => {
                        setEditJob(null);
                        loadJobs();
                    }}
                />
            )}


            {jobs.length === 0 ? (
                <div>No jobs posted yet.</div>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => {
                        const jr = job.jobRequirements;

                        return (
                            <div key={job._id} className="p-4 border rounded flex justify-between items-start">

                                {/* LEFT SIDE — JOB DETAILS */}
                                <div>
                                    <h4 className="font-bold text-lg">{job.title}</h4>

                                    {/* job status */}
                                    <p className="mt-1">
                                        Status:{" "}
                                        {job.closed ? (
                                            <span className="text-red-600 font-semibold">Closed</span>
                                        ) : (
                                            <span className="text-green-600 font-semibold">Open</span>
                                        )}
                                    </p>

                                    <p className="">{jr.category} • {jr.type} • {jr.exprience}</p>
                                    <p className="mt-1">{jr.location}</p>
                                    <p className="">₹ {jr.offeredSalary}</p>

                                    <p>
                                        Posted on: {new Date(job.jobRequirements.postDate).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                {/* RIGHT SIDE — ACTION BUTTONS */}
                                <div className="flex flex-col gap-2 items-end">

                                    {/* CLOSE JOB BUTTON (only if open) */}
                                    {!job.closed && (
                                        <button
                                            onClick={() => handleCloseJob(job._id)}
                                            className="px-3 py-1 bg-orange-500 text-white rounded"
                                        >
                                            Close Job
                                        </button>
                                    )}

                                    {/* CLOSED BADGE */}
                                    {job.closed && (
                                        <span className="px-3 py-1 bg-gray-400 text-white rounded">
                                            Closed
                                        </span>
                                    )}
                                    {/* edit  */}
                                    <button
                                        onClick={() => setEditJob(job)}
                                        className="text-blue-500 hover:underline mr-3"
                                    >
                                        Edit
                                    </button>


                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>

                                    {/* applicants  */}
                                    <button
                                        className="bg-violet-600 text-white px-3 py-1 rounded"
                                        onClick={() => navigate(`/company/applicants/${job._id}`)}
                                    >
                                        Applicants
                                    </button>

                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CompanyJobList;
