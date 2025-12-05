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
