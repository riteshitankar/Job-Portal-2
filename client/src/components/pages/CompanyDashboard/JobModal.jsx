import React, { useState } from "react";
import { companyCreateJob } from "../../../api/companyAPI";
import { useCompany } from "../../../context/companyContext";
import { useMessage } from "../../../context/messageContext";

const JobModal = ({ closeModal }) => {

  const { companyToken } = useCompany();
  const { showMessage } = useMessage();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    exprience: "",
    location: "",
    offeredSalary: "",
    description: "",
    
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const jobRequirements = {
        type: formData.type,
        category: formData.category,
        exprience: formData.exprience,
        location: formData.location,
        postDate: new Date(),
        offeredSalary: formData.offeredSalary,
        description: formData.description
      };

      let result = await companyCreateJob(companyToken, {
        title: formData.title,
        jobRequirements
      });

      showMessage(result.message, "success");
      closeModal();

    } catch (err) {
      showMessage("Failed to create job!", "error");
      console.log(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">

        <h3>Post a New Job</h3>

        <form onSubmit={handleSubmit} className="job-form">

          <input name="title" placeholder="Job Title" required onChange={handleChange} />
          <input name="type" placeholder="Job Type (Full-time / Part-time)" required onChange={handleChange} />
          <input name="category" placeholder="Category (Developer / Designer)" required onChange={handleChange} />
          <input name="exprience" placeholder="Experience Required" required onChange={handleChange} />
          <input name="location" placeholder="Location" required onChange={handleChange} />
          <input name="offeredSalary" placeholder="Offered Salary" type="number" required onChange={handleChange} />
          <textarea 
            name="description" 
            placeholder="Job Description" 
            rows="4" 
            required 
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit" className="create-btn">Create Job</button>
            <button type="button" className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default JobModal;

