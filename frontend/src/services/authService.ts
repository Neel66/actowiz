import axios from 'axios';
import { API_BASE_URL, AUTH_ROUTES } from '../constants/routes';
import { AUTH_MESSAGES } from '../constants/messages';

export const registerUser = async (userData: { name: string; email: string; password: string; role: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${AUTH_ROUTES.REGISTER}`, userData);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = AUTH_MESSAGES.registrationFailed;
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${AUTH_ROUTES.LOGIN}`, credentials);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = AUTH_MESSAGES.loginFailed;
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};
