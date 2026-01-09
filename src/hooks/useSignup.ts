import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://d-chat-backend-338h.onrender.com';

export type SignUpPayload = {
  userName: string;
  email: string;
  password: string;
  avatarUrl?: File| null;
};

export type User = {
  userName: string;
  email: string;
  _id: string;
  avatarUrl?: string;
};

export type SignUpResponse = {
   userName: string;
  email: string;
  _id: string;
  avatarUrl?: string;
  message?: string;
};

const useSignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SignUpResponse | null>(null);

 const signUp = async (payload: FormData): Promise<SignUpResponse> => {
  setLoading(true);
  setError(null);

  try {
    const res: AxiosResponse<SignUpResponse> = await axios.post(
      `${BASE_URL}/api/signup`,
      payload,
      {
          withCredentials: true,
      }
    );

    setData(res.data);
    console.log("Signup response data:", res.data, data);
    return res.data;
  } catch (err) {
    const message =
      axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Signup failed";

    setError(message);
    throw new Error(message);
  } finally {
    setLoading(false);
  }
};


  return { signUp, loading, error, data } as const;
};

export default useSignUp;
