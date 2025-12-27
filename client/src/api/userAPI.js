import axios from "axios"

let baseUrl = import.meta.env.VITE_BASE_API_URL + "/user"


export const requestUserRegister = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/register`, data)
        return result
    } catch (err) {
        throw err
    }
}

export const requestUserEmailOtpVerification = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/verify-otp`, data)
        return result
    } catch (err) {
        throw err
    }
}

export const requestUserLogin = async (data) => {
    try {
        let result = await axios.post(`${baseUrl}/user-login`, data)
        return result
    } catch (err) {
        throw err
    }
}

export const requestUserProfile = async (token) => {
    try {
        let result = await axios({
            method: "GET",
            url: `${baseUrl}/fetch-user-profile`,
            headers: {
                authorization: token
            }
        })

        return result

    } catch (err) {
        throw (err)
    }
}

export const userProfilePicture = async (token, formData) => {
    try {
        const result = await axios.post(
            `${baseUrl}/upload-file/profile_picture`,
            formData,
            {
                headers: {
                    authorization: token
                    // DO NOT add Content-Type manually
                }
            }
        );

        return result.data;

    } catch (err) {
        throw err;
    }
};

// export const requestOTPForPasswordReset = async (email) => {
//     try {
//         consoleur.log("reset passord for ", email)
//         const result = await axios.post(`${baseUrl}/password-reset-request`, { email });
//         return result
//     } catch (err) {
//         throw err
//     }
// }

// export const requestUserEmailOtpVerificationPasswordReset = async (data) => {
//     console.log(data)
//     try {
//         const result = await axios.post(`${baseUrl}/verify-reset-password-request`, data);
//         return result
//     } catch (err) {
//         throw err
//     }
// }

// client/src/api/userAPI.js
export const requestOTPForPasswordReset = async (email) => {
  const result = await axios.post(`${baseUrl}/password-reset-request`, { email });
  return result;
};

export const requestUserEmailOtpVerificationPasswordReset = async (data) => {
  const result = await axios.post(`${baseUrl}/verify-reset-password-request`, data);
  return result;
};



// src/api/userAPI.js
export const updateUserBio = async (token, bio) => {
    return axios.patch(
        `${import.meta.env.VITE_BASE_API_URL}/user/update-bio`,  // ← MUST HAVE /user
        { bio },
        {
            headers: {
                authorization: token,   // ← NOT "Authorization" or "Bearer"
                "Content-Type": "application/json"
            }
        }
    );
};


// src/api/userAPI.js
// export const uploadUserResume = (token, file) => {
//     const formData = new FormData();
//     formData.append("resume", file);  // ← MUST be named "resume"

//     return axios.post(
//         `${import.meta.env.VITE_BASE_API_URL}/user/upload-resume`,
//         formData,
//         {
//             headers: {
//                 authorization: token,
//                 // DO NOT set Content-Type — let browser set it with boundary
//             }
//         }
//     );
// };

export const uploadUserResume = (token, file) => {
  const fd = new FormData();
  fd.append("resume", file);

  return axios.post(
    `${baseUrl}/upload-resume`,
    fd,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


export const deleteUserResume = (token) => {
  return axios.delete(
    `${baseUrl}/delete-resume`,
    {
      headers: {
        authorization: token
      }
    }
  );
};



export const uploadUserCoverPhoto = async (token, formData) => {
  return axios.post(
    `${baseUrl}/upload-cover-photo`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


export const applyForJob = async (token, jobId) => {
  return await axios.post(
    `${import.meta.env.VITE_BASE_API_URL}/job/apply/${jobId}`,
    {},
    { headers: { authorization: token } }
  );
};



