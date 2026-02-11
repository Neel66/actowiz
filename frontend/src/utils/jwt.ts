export const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getRoleFromToken = (token: string): string | null => {
  const decoded = decodeJWT(token);
  return decoded ? decoded.role : null;
};
