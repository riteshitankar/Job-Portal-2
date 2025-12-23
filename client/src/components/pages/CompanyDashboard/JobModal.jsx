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
        description: formData.description,
      };

      let result = await companyCreateJob(companyToken, {
        title: formData.title,
        jobRequirements,
      });

      showMessage(result.message, "success");
      closeModal();
    } catch (err) {
      showMessage("Failed to create job!", "error");
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl animate-[scaleIn_0.25s_ease-out]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">
            Post a New Job
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input label="Job Title" name="title" onChange={handleChange} />

            <Input
              label="Job Type"
              name="type"
              placeholder="Full-time / Part-time"
              onChange={handleChange}
            />

            <Input
              label="Category"
              name="category"
              placeholder="Developer / Designer"
              onChange={handleChange}
            />

            <Input
              label="Experience Required"
              name="exprience"
              onChange={handleChange}
            />

            <Input label="Location" name="location" onChange={handleChange} />

            <Input
              label="Offered Salary (₹)"
              name="offeredSalary"
              type="number"
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              rows="4"
              required
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and expectations..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
            >
              Create Job
            </button>
          </div>
        </form>
      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

/* -------- SMALL REUSABLE INPUT -------- */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      required
      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

export default JobModal;
