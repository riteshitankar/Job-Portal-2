import React, { useState, useEffect } from "react";
import { createCompanyJob, editCompanyJob } from "../../../api/companyAPI.js";
import { useMessage } from "../../../context/messageContext.jsx";
import { motion } from "framer-motion";

const CompanyPostJobForm = ({ onPosted, editJobData = null, onEdited = null }) => {
  const { triggerMessage } = useMessage();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const emptyForm = {
    title: "",
    jobRequirements: {
      type: "",
      category: "",
      exprience: "",
      location: "",
      offeredSalary: "",
      description: "",
    },
    maxApplications: 0,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editJobData) {
      setForm({
        title: editJobData.title || "",
        jobRequirements: {
          type: editJobData.jobRequirements?.type || "",
          category: editJobData.jobRequirements?.category || "",
          exprience: editJobData.jobRequirements?.exprience || "",
          location: editJobData.jobRequirements?.location || "",
          offeredSalary: editJobData.jobRequirements?.offeredSalary || "",
          description: editJobData.jobRequirements?.description || "",
          postDate: editJobData.jobRequirements?.postDate || new Date(),
        },
        maxApplications: editJobData.maxApplications || 0,
      });
      setOpen(true);
    }
  }, [editJobData]);

  /* ================= FIELD HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("jobRequirements.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        jobRequirements: {
          ...prev.jobRequirements,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("company_token");

    const payload = {
      title: form.title,
      jobRequirements: {
        ...form.jobRequirements,
        postDate: form.jobRequirements.postDate || new Date(),
      },
      maxApplications: Number(form.maxApplications),
    };

    try {
      if (editJobData) {
        await editCompanyJob(token, editJobData._id, payload);
        triggerMessage("success", "Job updated successfully!");
        onEdited && onEdited();
      } else {
        await createCompanyJob(token, payload);
        triggerMessage("success", "Job posted successfully!");
        onPosted && onPosted();
      }

      setForm(emptyForm);
      setOpen(false);
    } catch (err) {
      console.log(err);
      triggerMessage("danger", "Failed to save job");
    }

    setLoading(false);
  };

  return (
    <div className="mt-8">

      {/* TOGGLE BUTTON */}
      {!editJobData && (
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
        >
          {open ? "Close Job Form" : "+ Post a New Job"}
        </button>
      )}

      {/* FORM */}
      {open && (
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gray-50 p-6 rounded-xl shadow-md space-y-6"
        >
          <h3 className="text-xl font-bold text-gray-800">
            {editJobData ? "Edit Job" : "Create New Job"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* JOB TITLE */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Job Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Frontend Developer"
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* TYPE */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Job Type</label>
              <input
                name="jobRequirements.type"
                value={form.jobRequirements.type}
                onChange={handleChange}
                placeholder="Full-time / Internship"
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <input
                name="jobRequirements.category"
                value={form.jobRequirements.category}
                onChange={handleChange}
                placeholder="IT / Marketing"
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Experience</label>
              <input
                name="jobRequirements.exprience"
                value={form.jobRequirements.exprience}
                onChange={handleChange}
                placeholder="0-2 years"
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Location</label>
              <input
                name="jobRequirements.location"
                value={form.jobRequirements.location}
                onChange={handleChange}
                placeholder="Remote / Mumbai"
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* SALARY */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Offered Salary</label>
              <input
                type="number"
                name="jobRequirements.offeredSalary"
                value={form.jobRequirements.offeredSalary}
                onChange={handleChange}
                placeholder="50000"
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* MAX APPLICATIONS */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Max Applications
              </label>
              <input
                type="number"
                name="maxApplications"
                value={form.maxApplications}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    maxApplications: e.target.value,
                  }))
                }
                placeholder="50"
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Job Description
              </label>
              <textarea
                name="jobRequirements.description"
                value={form.jobRequirements.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the role, responsibilities, and requirements..."
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
            >
              {loading
                ? "Saving..."
                : editJobData
                ? "Save Changes"
                : "Post Job"}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default CompanyPostJobForm;
