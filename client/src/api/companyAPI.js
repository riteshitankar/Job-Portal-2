import axios from "axios";

let baseUrl = import.meta.env.VITE_BASE_API_URL + "/company";
const BASE = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

export const requestCompanyRegister = async (data) => {
  try {
    let result = await axios.post(`${baseUrl}/register`, data);
    return result;
  } catch (err) {
    throw err;
  }
};

export const requestCompanyEmailOtpVerification = async (data) => {
  try {
    let result = await axios.post(`${baseUrl}/verify-otp`, data);
    return result;
  } catch (err) {
    throw err;
  }
};

export const requestCompanyLogin = async (data) => {
  try {
    let result = await axios.post(`${baseUrl}/company-login`, data);
    return result;
  } catch (err) {
    throw err;
  }
};

export const requestCompanyProfile = async (token) => {
  try {
    let result = await axios({
      method: "GET",
      url: `${baseUrl}/fetch-company-profile`,
      headers: { authorization: token }
    });
    return result;
  } catch (err) {
    throw err;
  }
};

export const companyUploadFile = async (token, fileType, formData) => {
  try {
    const result = await axios.post(
      `${baseUrl}/upload-file/${fileType}`,
      formData,
      {
        headers: {
          authorization: token
          // do not set Content-Type manually; browser will set multipart/form-data
        }
      }
    );
    return result.data;
  } catch (err) {
    throw err;
  }
};

export const uploadCompanyDocument = async (token, formData) => {
  try {
    const result = await axios.post(`${baseUrl}/upload-document`, formData, {
      headers: { authorization: token }
    });
    return result;
  } catch (err) {
    throw err;
  }
};

export const deleteCompanyDocument = async (token, filename) => {
  try {
    const result = await axios.delete(`${baseUrl}/delete-document`, {
      headers: { authorization: token },
      data: { filename }
    });
    return result;
  } catch (err) {
    throw err;
  }
};

export const updateCompanyBio = async (token, bio) => {
  try {
    const result = await axios.patch(`${baseUrl}/update-bio`, { bio }, {
      headers: { authorization: token }
    });
    return result;
  } catch (err) {
    throw err;
  }
};

export const requestCompanyPasswordReset = async (email) => {
  try {
    const result = await axios.post(`${baseUrl}/password-reset-request`, { email });
    return result;
  } catch (err) {
    throw err;
  }
};

export const verifyCompanyPasswordReset = async (data) => {
  try {
    const result = await axios.post(`${baseUrl}/verify-reset-password-request`, data);
    return result;
  } catch (err) {
    throw err;
  }
};



// create a job (company)


// get all jobs (public)
export const getAllJobs = async () => {
  try {
    const result = await axios.get(`${baseUrl.replace('/user','')}/job/get-jobs`);
    return result;
  } catch (err) {
    throw err;
  }
};

// Get all jobs (public)
export const getAllJobsAPI = async () => {
  return await axios.get(`${BASE}/job/get-jobs`);
};





export const createCompanyJob = async (token, payload) => {
  return await axios.post(
    `${import.meta.env.VITE_BASE_API_URL}/job/create`,
    payload,
    {
      headers: {
        authorization: token   // <-- this is correct for your backend
      }
    }
  );
};







// delete company job
export const deleteCompanyJob = async (token, jobId) => {
  return await axios.post(
    `${import.meta.env.VITE_BASE_API_URL}/job/action/delete/${jobId}`,
    {},
    {
      headers: { authorization: token }
    }
  );
};

// get jobs created by this company
export const getCompanyJobs = async (token) => {
  return await axios.get(
    `${import.meta.env.VITE_BASE_API_URL}/company/my-jobs`,
    {
      headers: { authorization: token }
    }
  );
};

// close company job
export const closeCompanyJob = async (token, jobId) => {
  return await axios.post(
    `${import.meta.env.VITE_BASE_API_URL}/job/action/close/${jobId}`,
    {},
    {
      headers: { authorization: token }
    }
  );
};
