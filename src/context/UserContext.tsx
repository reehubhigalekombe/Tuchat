import AsyncStorage from "@react-native-async-storage/async-storage";
import React , {ReactNode, createContext, useState, useEffect}from "react";
type CurrentUser = {
    id: string,
    name: string,
    handle: string,
    phone: string,
    avatar?: string,   
};
type UserContextType = {
    currentUser: CurrentUser | null;
    loading: boolean;
    login:(user:CurrentUser) => Promise<void>;
    logout: () => Promise<void>
    setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>
};
export const UserContext = createContext<UserContextType | undefined>(undefined);
type Props = {
    children: ReactNode;
} ;
const STORAGE_KEY = "currentUser";

export default function UserProvider ({children}: Props) {
    const[currentUser, setCurrentUser] = useState<CurrentUser| null>(null);
    const[loading, setLoading] = useState(true)

    useEffect(() => {
        loadCurrentUser()
    }, [])

    const loadCurrentUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
            if(storedUser) {
               const parsedUser: CurrentUser = JSON.parse(storedUser);
               setCurrentUser(parsedUser)
               console.log("Loaded currentUser:", parsedUser) 
            } else {
                console.log("No user found in AsyncStorage")
            }
        }catch(error) {
console.error("Failed to load current user:", error)
        } finally {
            setLoading(false)
        }
    }
        const login = async (user: CurrentUser) => {
            try {
                await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(user)
            );
            setCurrentUser(user)
            } catch(error) {
                console.error("Login error:", error);
            }
        };
        const logout = async () => {
          try {
              await AsyncStorage.removeItem(STORAGE_KEY)
            setCurrentUser(null)
          }catch(error) {
            console.error("Logout error:", error)
          }
        };
    return (
<UserContext.Provider
 value={{currentUser,  loading, logout, login, setCurrentUser}}>
    {children}
</UserContext.Provider>
    );
}