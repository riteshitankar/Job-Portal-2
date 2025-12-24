import React, { useEffect, useState } from "react";
import axios from "axios";
import "./jobTracker.scss";

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
    <div className="job-tracker-container">
      <h1 className="tracker-title">Job Application Status</h1>

      <div className="tracker-table-wrapper">
        <table className="tracker-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  No job applications yet
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.jobId}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>
                    <span className={`status ${job.status}`}>
                      {job.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTracker;
