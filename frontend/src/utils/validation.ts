export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};


export const validateName = (name: string): boolean => {
  return name.trim().length >= 5;
};

export const validateBugTitle = (title: string): boolean => {
  return title.trim().length >= 5 && title.trim().length <= 200;
};

export const validateBugDescription = (description: string): boolean => {
  return description.trim().length >= 10 && description.trim().length <= 1000;
};

export const validateBountyAmount = (amount: number): boolean => {
  return amount >= 0 && amount <= 1000000;
};
