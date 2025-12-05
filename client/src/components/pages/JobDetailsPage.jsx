import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllJobsAPI } from "../../api/companyAPI";
import Header from "../sections/includes/Header";
import Footer from "../sections/includes/Footer";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const res = await getAllJobsAPI();
      const allJobs = res.data.jobData || [];

      const foundJob = allJobs.find((j) => j._id === jobId);
      setJob(foundJob);
    } catch (err) {
      console.log("job load error:", err);
    }
  };

  if (!job)
    return (
      <>
        <Header />
        <div className="p-6 text-center">Loading job details...</div>
        <Footer />
      </>
    );

  const { title, jobRequirements, jobCreatedBy } = job;

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-6 bg-white mt-6 shadow rounded">
        <h1 className="text-3xl font-bold mb-3">{title}</h1>

        {/* Company Name */}
        <p className="text-gray-700 text-lg mb-2">
          <strong>Company:</strong>{" "}
          {job.companyDetails?.name || job.companyName || "Unknown Company"}
        </p>

        {/* Posted Date */}
        <p className="text-gray-600 mb-4">
          <strong>Posted on:</strong>{" "}
          {new Date(jobRequirements.postDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        <hr className="my-4" />

        <h2 className="text-xl font-semibold mb-2">Job Requirements</h2>

        <div className="space-y-2">
          <p>
            <strong>Job Type:</strong> {jobRequirements.type}
          </p>
          <p>
            <strong>Category:</strong> {jobRequirements.category}
          </p>
          <p>
            <strong>Experience:</strong> {jobRequirements.exprience}
          </p>
          <p>
            <strong>Location:</strong> {jobRequirements.location}
          </p>
          <p>
            <strong>Salary Offered:</strong> ₹{jobRequirements.offeredSalary}
          </p>
        </div>

        <hr className="my-4" />

        <h2 className="text-xl font-semibold mb-2">Job Description</h2>
        <p className="leading-relaxed text-gray-700">
          {jobRequirements.description}
        </p>

        <hr className="my-4" />

        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
        >
          Back to Jobs
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default JobDetailsPage;
