import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CompanyApplicantsPage = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [jobInfo, setJobInfo] = useState(null);

    const token = localStorage.getItem("company_token");

    useEffect(() => {
        loadApplicants();
    }, []);

    const loadApplicants = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/job/applicants/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setApplicants(res.data.applicants);
            setJobInfo(res.data.job);
        } catch (err) {
            console.log("Error loading applicants:", err);
        }
    };

    return (
        <div className="p-6">

            {jobInfo && (
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">{jobInfo.title}</h1>
                    <p className="opacity-70">{jobInfo.jobRequirements.category}</p>
                </div>
            )}

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Sr. No.</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Phone</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {applicants.map((u, idx) => (
                        <tr key={u._id}>
                            <td className="p-2 border">{idx + 1}</td>
                            <td className="p-2 border">{u.name}</td>
                            <td className="p-2 border">{u.phone}</td>
                            <td className="p-2 border">
                                {u.email?.userEmail || "N/A"}
                            </td>
                            <td className="p-2 border">
                                <select className="border p-1 rounded">
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accept</option>
                                    <option value="rejected">Reject</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
};

export default CompanyApplicantsPage;
