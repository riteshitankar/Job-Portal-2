import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CompanyApplicantsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("company_token");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/job/applicants/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJob(res.data.job);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchApplicants();
  }, []);

  const updateStatus = async (userId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/job/applicants/${jobId}/update`,
        { userId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update frontend state
      setJob((prev) => ({
        ...prev,
        applicants: prev.applicants.map((a) =>
          a.user._id === userId ? { ...a, status } : a
        ),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{job.jobCreatedBy.name}</h1>
      <h2 className="text-xl mt-2 font-semibold">Post: {job.title}</h2>

      <table className="w-full mt-6 border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Sr No.</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {job.applicants.map((app, index) => (
            <tr key={index}>
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{app.user.name}</td>
              <td className="p-2 border">{app.user.phone}</td>
              <td className="p-2 border">{app.user.email}</td>
              <td className="p-2 border capitalize">{app.status}</td>
              <td className="p-2 border flex gap-2">

                <button
                  onClick={() => updateStatus(app.user._id, "accepted")}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(app.user._id, "rejected")}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-green-700 font-semibold">
        Selected Profiles: {job.applicants.filter(a => a.status === "accepted").length}
      </div>
    </div>
  );
};

export default CompanyApplicantsPage;
