import axios from 'axios';
import { API_BASE_URL, BUG_ROUTES, USER_ROUTES } from '../constants/routes';
import { BUG_MESSAGES } from '../constants/messages';

export const createBug = async (bugData: {
  title: string;
  description: string;
  bountyAmount: number;
  isConfigurable: boolean;
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

export const submitBugFix = async (formData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}${USER_ROUTES.SUBMIT_BUG_FIX}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to submit bug fix';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

export const updateSubmissionStatus = async (submissionId: string, status: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/bugs/submissions/${submissionId}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to update submission status';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};
