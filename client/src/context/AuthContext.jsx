import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext();

export function AuthProvider({
  children
}) {

  const [isAuthenticated,
    setIsAuthenticated] =
    useState(
      localStorage.getItem("token")
        ? true
        : false
    );



  // LOGIN

  const login = () => {

    localStorage.setItem(
      "token",
      "admin_logged"
    );

    setIsAuthenticated(true);

  };



  // LOGOUT

  const logout = () => {

    localStorage.removeItem("token");

    setIsAuthenticated(false);

  };



  return (

    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}



export function useAuth() {

  return useContext(AuthContext);

}