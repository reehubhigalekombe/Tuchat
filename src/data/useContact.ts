import   {useState, useEffect} from "react";
import Contacts, {Contact} from "react-native-contacts";
import { Platform, PermissionsAndroid } from "react-native";
import axios from "axios";

const BASE_URL = "https://tuback-8pr0.onrender.com";

export type RegisteredUser = {
    _id: string; name: string; handle: string; phone: string; avatar?: string; isOnline?: string
}

export default function useContact() {
      const[contacts, setContacts] = useState<Contact[]>([]);
      const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
      
      const normalizePhone = (phone: string) => {
        let cleaned =  phone.replace(/\D/g, "");
        // Here we convert Kenyan local contacts (07....) to the international format (254...);
        if(cleaned.startsWith("0")) {
            cleaned = "254" + cleaned.slice(1)
        }
        return cleaned;
      }
      const loadContacts = async () => {
              try {
                  const deviceContacts = await Contacts.getAll();
                  setContacts(deviceContacts);
                  syncContacts(deviceContacts);
              }catch(err) {
          console.log("Error loading contacts", err)
              };
          }
      const syncContacts = async (deviceContacts: Contact[]) => {
       try {
          const formatted = deviceContacts
           .filter(c => c.phoneNumbers.length > 0)
           .map(c =>  ({
            phone: normalizePhone(c.phoneNumbers[0].number)
            .replace(/\D/g, "")
           }));
             const res = await axios.post(`${BASE_URL}/contacts/sync`, {
            contacts: formatted}
        );
        console.log("Sending", formatted);
        console.log("Recieved", res.data)
            setRegisteredUsers(res.data);
        console.log("Registered users", res.data)
       
      }catch (err) {
        console.log("Sync error", err)
      }
    }

    const requestContactsPermission = async () => {
              if(Platform.OS === "android") {
                  const granted = await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.READ_CONTACTS
                  );
                  if(granted === PermissionsAndroid.RESULTS.GRANTED) {
                      loadContacts()
                  } else {
                      console.log("Contacts permission denied")
                  }
              }
          }

    useEffect(() => {
requestContactsPermission();
    }, []);
 return {
contacts,
 registeredUsers
 };
}
