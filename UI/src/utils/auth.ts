export const saveUserToLocal = (user: any) => {
  localStorage.setItem("token", user.token);
  localStorage.setItem("loggedInUser", JSON.stringify(user));
};

export const getLoggedInUser = () => {
  const u = localStorage.getItem("loggedInUser");
  return u ? JSON.parse(u) : null;
};
