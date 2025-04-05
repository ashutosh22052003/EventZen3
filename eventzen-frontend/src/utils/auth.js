// src/utils/auth.js
export const loginUser = (token) => {
    localStorage.setItem("auth_token", token);
  };
  
  export const logoutUser = () => {
    localStorage.removeItem("auth_token");
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem("auth_token");
  };
  