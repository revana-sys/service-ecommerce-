
export const getToken = () => localStorage.getItem("token");
export const getUser = () => JSON.parse(localStorage.getItem("user"));
export const isAdmin = () => {
  const user = getUser();
  return user && user.role === "admin";
};
export const isCustomer = () => {
  const user = getUser();
  return user && user.role === "customer";
};