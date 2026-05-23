import   {useState, useEffect} from "react";

import Contacts from "react-native-contacts";
import { Platform, PermissionsAndroid } from "react-native";

export type Contact = {
    recordID: string;
    givenName: string;
    familyName?:  string;
    phoneNumbers: {
        number: string}[];

        thumbnailPath?: string;
        hasThumbnail?: boolean;
};

export default function useContact() {
      const[contacts, setContacts] = useState<Contact[]>([]);

      
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

          const loadContacts = async () => {
              
              try {
                  const deviceContacts = await Contacts.getAll() as Contact[];
                  setContacts(deviceContacts);
          
              }catch(err) {
          console.log("Error loading contacts", err)
              };
          }

    useEffect(() => {
requestContactsPermission();
    }, []);
 return contacts



}