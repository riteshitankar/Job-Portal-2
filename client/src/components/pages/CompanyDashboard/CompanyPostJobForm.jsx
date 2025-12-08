import React, { useState, useEffect } from "react";
import { createCompanyJob, editCompanyJob } from "../../../api/companyAPI.js";
import { useMessage } from "../../../context/messageContext.jsx";
import { useCompany } from "../../../context/companyContext.jsx";

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

    // FORM FIELD HANDLER
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

    // SUBMIT FORM
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

            setOpen(false);
            setForm(emptyForm); // reset form after posting

        } catch (err) {
            console.log(err);
            triggerMessage("danger", "Failed to save job");
        }

        setLoading(false);
    };

    return (
        <div className="mt-6">
            {!editJobData && (
                <button
                    onClick={() => setOpen(!open)}
                    className="bg-primary text-white px-4 py-2 rounded"
                >
                    {open ? "Close Job Form" : "Post a New Job"}
                </button>
            )}

            {open && (
                <form onSubmit={submit} className="mt-4 bg-white p-4 rounded shadow">
                    <div className="grid grid-cols-2 gap-4">
                        
                        {/* Title */}
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

                        {/* Type */}
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

                        {/* Category */}
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

                        {/* Experience */}
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

                        {/* Location */}
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

                        {/* Salary */}
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

                        {/* Description */}
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

                        {/* Max Applications */}
                        <div>
                            <label className="opacity-70">Max Applications</label>
                            <input
                                name="maxApplications"
                                type="number"
                                value={form.maxApplications}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        maxApplications: e.target.value,
                                    }))
                                }
                                className="mt-2 w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            {loading ? "Saving..." : editJobData ? "Save Changes" : "Post Job"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CompanyPostJobForm;
