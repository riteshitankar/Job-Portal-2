import express from "express";
import {
  createJob,
  handleJobAction,
  handleJobApplication,
  getJobData
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

export { jobRouter };
