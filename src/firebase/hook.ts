import {useContext, useEffect, useState} from "react";
import {DataContext} from "../PrivateZone";

export const useContacts = (mapFunction = id => id) => {
    const data = useContext(DataContext);
    const [contacts, setContacts] = useState<any[]>([] as any[]);
    useEffect(() => {
        const subscription = data.contacts.subscribe((contacts) => {
            setContacts(mapFunction(contacts));
        });
        return () => subscription.unsubscribe();
    }, []);
    return contacts;
};

export const useChats = (mapFunction = id => id) => {
    const data = useContext(DataContext);
    const [contacts, setContacts] = useState<any[]>([] as any[]);
    useEffect(() => {
        const subscription = data.chats.subscribe((contacts) => {
            setContacts(mapFunction(contacts));
        });
        return () => subscription.unsubscribe();
    }, []);
    return contacts;
};
