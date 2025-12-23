import { useEffect, useState } from "react";
import { getAllJobsAPI } from "../../api/companyAPI";
import { Link } from "react-router-dom";

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
      {jobs.map((job) => {
        const isClosed = job.closed;
        const isLimitReached =
          job.applications?.length >= job.maxApplications;

        return (
          <div
            key={job._id}
            className="relative border rounded-xl p-5 shadow-sm hover:shadow-lg transition bg-white"
          >
            {/* STATUS BADGE */}
            <span
              className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full
            ${isClosed
                  ? "bg-red-100 text-red-700"
                  : isLimitReached
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
            >
              {isClosed
                ? "Closed"
                : isLimitReached
                  ? "Limit Reached"
                  : "Open"}
            </span>

            <h2 className="text-xl font-bold text-blue-700 mb-1">
              {job.title}
            </h2>

            <p className="text-gray-700">
              <strong>Company:</strong>{" "}
              {job.jobCreatedBy?.companyDetails?.name}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Posted on{" "}
              {new Date(job.jobRequirements.postDate).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

            <div className="mt-4">
              <Link
                to={`/job/${job._id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                View Details →
              </Link>
            </div>
          </div>
        );
      })}
    </div>

  );
};

export default HomeJobList;
