import axios from "axios";
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!user) {
                    const { data } = await axios.get('/profile', { withCredentials: true });
                    setUser(data);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
    
        fetchUserProfile();
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
