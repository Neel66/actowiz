export const API_BASE_URL = 'http://localhost:3000/api';

export const AUTH_ROUTES = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
};

export const BUG_ROUTES = {
  CREATE: '/bugs',
  GET_ALL: '/bugs',
};

export const USER_ROUTES = {
  GET_BUGS: '/users/bugs',
  SUBMIT_BUG_FIX: '/users/submit-bug-fix',
  GET_BALANCE: '/users/balance',
};
