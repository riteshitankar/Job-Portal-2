import React, { useEffect, useState } from "react";
import axios from "axios";

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/applied-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(res.data.jobs);
    } catch (err) {
      console.log("Error loading applied jobs:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Application Status</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Job Title</th>
            <th className="p-2 border">Company</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job.jobId}>
              <td className="p-2 border">{job.title}</td>
              <td className="p-2 border">{job.company}</td>
              <td
                className={`p-2 border font-bold ${
                  job.status === "accepted"
                    ? "text-green-600"
                    : job.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {job.status.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTracker;
