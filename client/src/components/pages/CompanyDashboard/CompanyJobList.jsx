import React, { useEffect, useState } from "react";
import { getCompanyJobs, deleteCompanyJob } from "../../../api/companyAPI.js";
import { useMessage } from "../../../context/messageContext.jsx";

const CompanyJobList = () => {
    const [jobs, setJobs] = useState([]);
    const { triggerMessage } = useMessage();

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
    }, []);

    const handleDelete = async (jobId) => {
        if (!confirm("Delete this job?")) return;

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

    return (
        <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-3">My Posted Jobs</h3>

            {jobs.length === 0 ? (
                <div>No jobs posted yet.</div>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => {
                        const jr = job.jobRequirements;
                        return (
                            <div key={job._id} className="p-4 border rounded flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-lg">{job.title}</h4>
                                    <p className="">{jr.category} • {jr.type} • {jr.exprience}</p>
                                    <p className=" mt-1">{jr.location}</p>
                                    <p className="">₹ {jr.offeredSalary}</p>
                                    <p>
                                        Posted on: {new Date(job.jobRequirements.postDate).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDelete(job._id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CompanyJobList;
