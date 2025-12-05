import React, { useState } from "react";
import { companyCreateJob } from "../../../api/companyAPI";
import { useCompany } from "../../../context/companyContext";
import { useMessage } from "../../../context/messageContext";

const PostJobForm = ({ onClose }) => {
  const { message } = useMessage();

  const [jobData, setJobData] = useState({
    title: "",
    type: "",
    category: "",
    exprience: "",
    location: "",
    offeredSalary: "",
    description: "",
  });

  let handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      title: jobData.title,
      jobRequirements: {
        type: jobData.type,
        category: jobData.category,
        exprience: jobData.exprience,
        location: jobData.location,
        offeredSalary: jobData.offeredSalary,
        description: jobData.description,
      },
    };

    try {
      let result = await companyCreateJob(payload);

      if (result.status === 202) {
        message.success("Job posted successfully!");
        onClose(); // close form
      }
    } catch (err) {
      console.log("job posting error:", err);
      message.error("Failed to post job!");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        <h2>Post a New Job</h2>

        <form onSubmit={handleSubmit} className="form">

          <input type="text" name="title" placeholder="Job Title"
            value={jobData.title} onChange={handleChange} required />

          <input type="text" name="type" placeholder="Job Type (Full-Time, Remote)"
            value={jobData.type} onChange={handleChange} required />

          <input type="text" name="category" placeholder="Category"
            value={jobData.category} onChange={handleChange} required />

          <input type="text" name="exprience" placeholder="Experience Required"
            value={jobData.exprience} onChange={handleChange} required />

          <input type="text" name="location" placeholder="Job Location"
            value={jobData.location} onChange={handleChange} required />

          <input type="number" name="offeredSalary" placeholder="Offered Salary"
            value={jobData.offeredSalary} onChange={handleChange} required />

          <textarea name="description" placeholder="Job Description"
            value={jobData.description} onChange={handleChange} required></textarea>

          <div className="row">
            <button type="submit" className="btn-primary">Submit</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostJobForm;
