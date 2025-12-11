import express from "express";
import { createJob, handleJobAction, handleJobApplication, getJobData,  editJob, getApplicants, updateApplicantStatus
} from "../controllers/jobController.js";
import { AuthCompany } from "../middlewares/AuthCompany.js";
import { AuthUser } from "../middlewares/AuthUser.js";

const jobRouter = express.Router();

// company creates job
jobRouter.post("/create", AuthCompany, createJob);

// company actions on job (delete/close)
jobRouter.post("/action/:action/:jobId", AuthCompany, handleJobAction);

// user applies for job
jobRouter.post("/apply/:jobId", AuthUser, handleJobApplication);

// get all jobs (public)
jobRouter.get("/get-jobs", getJobData);

// for edit job 
jobRouter.patch("/edit/:jobId", AuthCompany, editJob);

jobRouter.get("/job/applicants/:jobId", AuthCompany, getApplicants);

jobRouter.put("/job/applicants/:jobId/update", AuthCompany, updateApplicantStatus);


export { jobRouter };
