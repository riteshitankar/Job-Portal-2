import { companyModel } from "../models/companySchema.js";
import { jobModel } from "../models/jobSchema.js";
import { userModel } from "../models/userSchema.js";

const createJob = async (req, res) => {
  try {
    const company = req.company;
    if (!company)
      return res.status(401).json({ message: "Login as company first" });

    const { title, jobRequirements } = req.body;
    if (!title || !jobRequirements)
      return res.status(400).json({ message: "Missing job data" });

    const { type, category, exprience, location, offeredSalary, description } =
      jobRequirements;

    if (!type || !category || !exprience || !location || !offeredSalary || !description)
      return res.status(400).json({ message: "Invalid job requirements" });

    let newJob = new jobModel({
      title,
      jobCreatedBy: company._id,
      jobRequirements,
      maxApplications: jobRequirements.maxApplications,
    });


    const result = await newJob.save();
    await companyModel.findByIdAndUpdate(company._id, {
      $push: { createJobs: result._id },
    });

    res.status(202).json({ message: "Job created successfully!" });
  } catch (err) {
    console.log("Job creation error:", err);
    res.status(500).json({ message: "Unable to create job", err });
  }
};

const handleJobAction = async (req, res) => {
  try {
    const company = req.company;
    if (!company)
      return res.status(401).json({ message: "Login as company first" });

    const { jobId, action } = req.params;

    if (action === "delete") {
      await jobModel.findByIdAndDelete(jobId);
      return res.status(202).json({ message: "Job deleted!" });
    }

    if (action === "close") {
      await jobModel.findByIdAndUpdate(jobId, { $set: { closed: true } });
      return res.status(202).json({ message: "Job closed!" });
    }

    return res.status(400).json({ message: "Invalid job action!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Job action failed", err });
  }
};

const handleJobApplication = async (req, res) => {
  try {
    let user = req.user;
    if (!user) throw "User not logged in!";

    let { jobId } = req.params;

    let job = await jobModel.findById(jobId);
    if (!job) throw "Job not found!";

    if (job.closed) {
      return res.status(400).json({ message: "This job is already closed!" });
    }

    if (job.applications.includes(user._id)) {
      return res.status(400).json({ message: "You have already applied!" });
    }

    if (job.applications.length >= job.maxApplications) {
      // auto close job 
      await jobModel.findByIdAndUpdate(jobId, { closed: true });

      return res
        .status(400)
        .json({ message: "Application limit reached. Job is now closed!" });
    }

    await jobModel.findByIdAndUpdate(jobId, {
      $push: { applications: user._id }
    });

    await userModel.findByIdAndUpdate(user._id, {
      $push: { appliedJobs: jobId }
    });

    res.status(202).json({ message: "Applied for job successfully!" });

  } catch (err) {
    console.log("Apply job error:", err);
    res.status(400).json({ message: err.toString() });
  }
};


const getJobData = async (req, res) => {
  try {
    const jobData = await jobModel
      .find({})
      .populate("jobCreatedBy", "companyDetails name companyLogo");

    res.status(200).json({ message: "jobs loaded", jobData });
  } catch (err) {
    console.log("get jobs err:", err);
    res.status(500).json({ message: "Unable to load jobs", err });
  }
};

const editJob = async (req, res) => {
  try {
    const company = req.company;
    if (!company) throw "Invalid request. Please login first!";

    const { jobId } = req.params;
    const { title, jobRequirements, maxApplications } = req.body;

    const job = await jobModel.findById(jobId);
    if (!job) throw "Job not found!";
    if (job.jobCreatedBy.toString() !== company._id.toString())
      throw "Unauthorized — this job does not belong to you.";

    const updatedJob = await jobModel.findByIdAndUpdate(
      jobId,
      {
        title,
        jobRequirements,
        maxApplications,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Job updated successfully!",
      updatedJob,
    });

  } catch (err) {
    console.log("edit job error:", err);
    res.status(400).json({ message: "Unable to update job!", err });
  }
};


export { createJob, handleJobAction, handleJobApplication, getJobData, editJob };
