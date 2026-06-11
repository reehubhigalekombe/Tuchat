import React , {ReactNode, createContext, useState}from "react";
type CurrentUser = {
    id: string,
    name: string,
    handle: string,
    phone: string,
    avatar: string,
};
type UserContextType = {
    currentUser: CurrentUser | null;
    setCurrentUser: (user: CurrentUser | null) => void
};
export const UserContext = createContext<UserContextType | undefined>(undefined);
type Props = {
    children: ReactNode;
}
export default function UserProvider ({children}: Props) {
    const[currentUser, setCurrentUser] = 
    useState<CurrentUser| null>(null);

    return (
<UserContext.Provider value={{currentUser, setCurrentUser}}>
    {children}
</UserContext.Provider>
    )
}