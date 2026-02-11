import axios from 'axios';
import { API_BASE_URL, BUG_ROUTES } from '../constants/routes';
import { BUG_MESSAGES } from '../constants/messages';

export const createBug = async (bugData: {
  title: string;
  description: string;
  bountyAmount: number;
  isConfigurable: boolean;
  status: string;
}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}${BUG_ROUTES.CREATE}`, bugData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = BUG_MESSAGES.createFailed;
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

export const getBugs = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}${BUG_ROUTES.GET_ALL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch bugs';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};
