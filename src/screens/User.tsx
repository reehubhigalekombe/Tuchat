import React , {ReactNode, createContext, useState}from "react";
type UserContextType = {
    avatar: string;
    setAvatar: (uri: string) => void
};
export const UserContext = createContext<UserContextType | undefined>(undefined);
type Props = {
    children: ReactNode;
}
export default function User ({children}: Props) {
    const[avatar, setAvatar] = useState<string>( "https://drive.google.com/uc?export=view&id=1niTtaBYKNWAvx9FbUtFVmBkgH6n-uxi3",);

    return (
<UserContext.Provider value={{avatar, setAvatar}}>
    {children}
</UserContext.Provider>
    )
}