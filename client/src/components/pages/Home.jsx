import React, { useEffect, useState } from "react";
import JobCard from "../JobCard.jsx";
import { getAllJobs } from "../../api/companyAPI.js"; // or correct relative path
import Header from '../sections/includes/Header'
import Footer from '../sections/includes/Footer'
const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      if (res.status === 200) setJobs(res.data.jobData || []);
    } catch (err) {
      console.log("fetch jobs err", err);
    }
  };

  return (
    <>
      {/* keep your existing Header etc */}
      <Header />
      <div className="content-container p-6">
        <h2 className="text-2xl font-bold mb-4">Latest Jobs</h2>
        <div>
          {jobs.length > 0 ? jobs.map((j) => <JobCard key={j._id} job={j} />) : <div>No jobs posted yet</div>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
