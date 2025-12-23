import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../sections/includes/Header";
import Footer from "../../sections/includes/Footer";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from "react-icons/fa";

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
      const res = await axios.get(
        `http://localhost:5000/job/applicants/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplicants(res.data.applicants);
      setJobInfo(res.data.job);
    } catch (err) {
      console.log("Error loading applicants:", err);
    }
  };

  const updateStatus = async (userId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/job/applicants/${jobId}/update`,
        { userId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplicants(prev =>
        prev.map(a => (a._id === userId ? { ...a, status } : a))
      );
    } catch (err) {
      console.log("Update status error:", err);
    }
  };

  const count = status =>
    applicants.filter(a => a.status === status).length;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">

          {/* JOB HEADER */}
          {jobInfo && (
            <div className="bg-white p-6 rounded-xl shadow mb-6">
              <h1 className="text-3xl font-bold">{jobInfo.title}</h1>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                {jobInfo.jobRequirements.category}
              </span>
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total" value={applicants.length} color="blue" />
            <StatCard title="Pending" value={count("pending")} color="gray" />
            <StatCard title="Accepted" value={count("accepted")} color="green" />
            <StatCard title="Rejected" value={count("rejected")} color="red" />
          </div>

          {/* APPLICANTS */}
          {applicants.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-center text-gray-500">
              No applicants yet.
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((u, idx) => (
                <div
                  key={u._id}
                  className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >

                  {/* LEFT */}
                  <div className="space-y-1">
                    <p className="font-semibold flex items-center gap-2">
                      <FaUser /> {idx + 1}. {u.name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <FaPhone /> {u.phone}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 break-all">
                      <FaEnvelope /> {u.email?.userEmail || "N/A"}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-start md:items-end gap-2">

                    {/* STATUS */}
                    <StatusBadge status={u.status} />

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                      <button
                        disabled={u.status !== "pending"}
                        onClick={() => updateStatus(u._id, "accepted")}
                        className={`px-4 py-1 rounded text-white text-sm
                          ${u.status !== "pending"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"}`}
                      >
                        Accept
                      </button>

                      <button
                        disabled={u.status !== "pending"}
                        onClick={() => updateStatus(u._id, "rejected")}
                        className={`px-4 py-1 rounded text-white text-sm
                          ${u.status !== "pending"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"}`}
                      >
                        Reject
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

/* --------- SMALL UI COMPONENTS -------- */

const StatCard = ({ title, value, color }) => (
  <div className={`bg-white rounded-xl shadow p-4 border-t-4 border-${color}-500`}>
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    accepted: {
      color: "bg-green-600",
      icon: <FaCheckCircle />,
      label: "Accepted"
    },
    rejected: {
      color: "bg-red-600",
      icon: <FaTimesCircle />,
      label: "Rejected"
    },
    pending: {
      color: "bg-gray-500",
      icon: <FaClock />,
      label: "Pending"
    }
  };

  const s = config[status];

  return (
    <span
      className={`flex items-center gap-2 px-3 py-1 rounded text-white text-sm ${s.color}`}
    >
      {s.icon}
      {s.label}
    </span>
  );
};

export default CompanyApplicantsPage;
