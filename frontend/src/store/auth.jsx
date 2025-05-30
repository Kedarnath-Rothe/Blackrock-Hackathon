import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token'));

    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useState("");

    const[isLoading, setIsLoading] = useState(true);

    const [courses, setCourses] = useState([]);

    const authorizationToken = `Bearer ${token}`;

  //function to stored the token in local storage
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken)                                                  //No need to refresh page after the login
    return localStorage.setItem("token", serverToken);
  };

  let isLoggedIn = !!token;
  console.log("isLoggedIn",isLoggedIn);

  //Tackle Logout
  const LogoutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
  }

  // JWT AUTHENICATION - to get the currently logged in user data 

  const userAuthentication = async() => {
    try{
      if(!isLoggedIn) return ;
      setIsLoading(true);
      const response = await fetch('https://blackrock-hackathon.vercel.app/api/auth/user',{
        method : "GET",
        headers : {
          Authorization : authorizationToken
        }
      })

      // console.log(response);

      if(response.ok){
        const data = await response.json();
        // console.log(data.userData);
        setUser(data.userData);
        setIsLoading(false);
      }
      else{
        console.log("Error fetching user data");
        setIsLoading(false);
      }
    }
    catch(error){
      console.error("error fetching user data");
    }
  }

  //to fetch the courses data from database

  const getCourses = async () => {
    try { 
        const response = await fetch('https://blackrock-hackathon.vercel.app/api/data/course', {
            method: "GET"
        });

        console.log("hoiii");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const courses = await response.json(); 
        console.log(courses.data);

        // Assuming setCourses is a state updater function
        setCourses(courses.data);
    } catch (error) {
        console.error('Error fetching or parsing data:', error.message); 
    }
};


  useEffect(() => {
    getCourses()
    userAuthentication();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <AuthContext.Provider value={{isLoggedIn, storeTokenInLS, LogoutUser, user, courses,  authorizationToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};