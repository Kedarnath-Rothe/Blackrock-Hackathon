import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../store/auth";

const Logout = () => {
    const { LogoutUser, user } = useAuth();  // Assuming user object contains userId

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post('https://blackrock-hackathon.vercel.app/api/auth/logout', { userId: user._id });
                LogoutUser();
                window.location.href = `/login`;
            } catch (error) {
                console.error('Error logging out:', error);
            }
        };

        logout();
    }, [LogoutUser, user]);

    return null;  // No need to return any JSX as we are redirecting
};

export default Logout;
