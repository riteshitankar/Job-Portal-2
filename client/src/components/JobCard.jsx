import React from "react";

const JobCard = ({ job }) => {
  const jr = job.jobRequirements || {};
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="mt-2">
            {job.closed ? (
              <span className="text-red-600 font-bold">Closed</span>
            ) : (
              <span className="text-green-600 font-bold">Open</span>
            )}
          </p>

          <h3 className="text-lg font-bold">{job.title}</h3>
          <p className="text-sm text-gray-600">{jr.category} • {jr.type} • {jr.exprience}</p>
          <p className="text-sm text-gray-500 mt-2">{jr.description?.slice(0, 180)}{jr.description && jr.description.length > 180 ? "..." : ""}</p>
        </div>
        <div className="text-right">
          <div className="text-sm">Salary</div>
          <div className="font-bold text-lg">₹ {jr.offeredSalary}</div>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-500">Location: {jr.location}</div>
        <div className="text-sm text-gray-500">Posted: {new Date(jr.postDate).toLocaleDateString()}</div>
      </div>
    </div>
  );
};

export default JobCard;
