import React, { useEffect, useState } from "react";
import { getAppliedJobs } from "../../../api/userAPI.js";
import { useMessage } from "../../../context/messageContext.jsx";

/**
 * Shows the table:
 * Sr. No. | Company Name | Job Title | Remark (Applied - green)
 *
 * Usage: render <UserJobTracker /> where you previously had "this is job tracker"
 */

const UserJobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const { triggerMessage } = useMessage();

  useEffect(() => {
    loadAppliedJobs();
  }, []);

  const loadAppliedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getAppliedJobs(token);
      if (res.status === 200) {
        setJobs(res.data.jobs || []);
      } else {
        triggerMessage("danger", "Unable to load applied jobs");
      }
    } catch (err) {
      console.error("loadAppliedJobs err:", err);
      triggerMessage("danger", "Failed to load applied jobs");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-2xl font-semibold mb-4">Job Application Tracker</h3>

      {jobs.length === 0 ? (
        <div className="text-gray-600">You haven't applied for any jobs yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Sr. No.</th>
                <th className="p-3 border">Company Name</th>
                <th className="p-3 border">Job Title</th>
                <th className="p-3 border">Remark</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, idx) => (
                <tr key={job._id} className="border-b">
                  <td className="p-3 border align-top">{idx + 1}</td>
                  <td className="p-3 border align-top">
                    {job.jobCreatedBy?.companyDetails?.name || "Unknown Company"}
                  </td>
                  <td className="p-3 border align-top">{job.title}</td>
                  <td className="p-3 border align-top">
                    <span className="text-green-700 font-semibold">Applied</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserJobTracker;
