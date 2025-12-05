import { useEffect, useState } from "react";
import { getAllJobsAPI } from "../../api/companyAPI";

const HomeJobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await getAllJobsAPI();
      setJobs(res.data.jobData || []);
    } catch (err) {
      console.log("Job fetch error:", err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div 
          key={job._id} 
          className="border rounded-lg p-5 shadow hover:shadow-lg transition bg-white"
        >
          <h2 className="text-xl font-bold text-blue-700">{job.title}</h2>

          <p className="text-gray-600 mt-1">
            <strong>Company:</strong> {job.jobCreatedBy?.companyDetails?.name}
          </p>

          <p className="text-gray-500 text-sm mt-1">
            Posted on:{" "}
            {new Date(job.jobRequirements.postDate).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

          <button
            onClick={() => window.location.href = `/job/${job._id}`}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            View More
          </button>
        </div>
      ))}
    </div>
  );
};

export default HomeJobList;
