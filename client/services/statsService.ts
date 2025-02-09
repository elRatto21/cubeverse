import axios from "axios";

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/solve/alltime`,
      {
        withCredentials: true,
      }
    );

    return response.data.data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getUserStats = async () => {
  
}