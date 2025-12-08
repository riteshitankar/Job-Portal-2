import React, { useState, useEffect } from "react";
import { createCompanyJob, editCompanyJob } from "../../../api/companyAPI.js";
import { useMessage } from "../../../context/messageContext.jsx";
import { useCompany } from "../../../context/companyContext.jsx";

const CompanyPostJobForm = ({ onPosted, editJobData = null, onEdited = null }) => {
    const { triggerMessage } = useMessage();
    const { fetchCompanyProfile } = useCompany();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState(
        editJobData || {
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
        }
    );

    // Auto-open and preload when editing
    useEffect(() => {
        if (editJobData) {
            setForm(editJobData);
            setOpen(true);
        }
    }, [editJobData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes("jobRequirements.")) {
            const key = name.split(".")[1];
            setForm(prev => ({
                ...prev,
                jobRequirements: {
                    ...prev.jobRequirements,
                    [key]: value
                }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

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
                if (onEdited) onEdited();
            } else {
                await createCompanyJob(token, payload);
                triggerMessage("success", "Job posted successfully!");
                if (onPosted) onPosted();
            }

            setOpen(false);

        } catch (err) {
            triggerMessage("danger", "Failed to save job");
            console.log(err);
        }

        setLoading(false);
    };

    return (
        <div className="mt-6">

            {/* NEW / EDIT job toggle button */}
            {!editJobData && (
                <button
                    onClick={() => setOpen(!open)}
                    className="bg-primary text-white px-4 py-2 rounded"
                >
                    {open ? "Close Job Form" : "Post a Job"}
                </button>
            )}

            {open && (
                <form onSubmit={submit} className="mt-4 bg-white p-4 rounded shadow">
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="opacity-70">Job Title</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="opacity-70">Job Type</label>
                            <input
                                name="jobRequirements.type"
                                value={form.jobRequirements.type}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="opacity-70">Category</label>
                            <input
                                name="jobRequirements.category"
                                value={form.jobRequirements.category}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="opacity-70">Experience</label>
                            <input
                                name="jobRequirements.exprience"
                                value={form.jobRequirements.exprience}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="opacity-70">Location</label>
                            <input
                                name="jobRequirements.location"
                                value={form.jobRequirements.location}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="opacity-70">Offered Salary</label>
                            <input
                                name="jobRequirements.offeredSalary"
                                type="number"
                                value={form.jobRequirements.offeredSalary}
                                onChange={handleChange}
                                required
                                className="mt-2 w-full p-2 border rounded"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="opacity-70">Description</label>
                            <textarea
                                name="jobRequirements.description"
                                value={form.jobRequirements.description}
                                onChange={handleChange}
                                rows="5"
                                required
                                className="mt-2 w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="opacity-70">Max Applications</label>
                            <input
                                name="maxApplications"
                                type="number"
                                min="0"
                                value={form.maxApplications}
                                onChange={handleChange}
                                className="mt-2 w-full p-2 border rounded"
                                required
                            />
                        </div>

                    </div>

                    <div className="mt-4 flex gap-2">
                        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
                            {loading ? "Saving..." : editJobData ? "Save Changes" : "Post Job"}
                        </button>

                        <button type="button" onClick={() => setOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CompanyPostJobForm;
