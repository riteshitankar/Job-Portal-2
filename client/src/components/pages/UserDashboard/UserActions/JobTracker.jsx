import React, { useEffect, useState } from "react";
import axios from "axios";

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("user_token");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const res = await axios.get("http://localhost:5000/user/applied-jobs", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setJobs(res.data.jobs);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Job Application Status</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Job Title</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map(job => (
            <tr key={job.jobId}>
              <td className="p-2 border">{job.title}</td>
              <td className="p-2 border capitalize">
                {job.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTracker;
