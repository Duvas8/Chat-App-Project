import { createContext, useState, useContext, useEffect } from "react";
import AuthContext from '../context/AuthProvider';
import axios from 'axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const USERCONTACTS_URL = 'http://localhost:3000/users';
const PRIVETCONVERSATION_URL = 'http://localhost:3000/privetConverstion';
const ContactsContext = createContext({});

export const ContactsProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [privateConversation, setPrivateConverstion ] = useState([])
  const [loading, setLoading] = useState(true); // Add loading state
  const axiosPrivate = useAxiosPrivate()


  const userId = auth.id;
  const fetchData = async () => {
    
    try {
      const response = await axiosPrivate.get(`${USERCONTACTS_URL}/${userId}`);
      setContacts(response.data.contacts);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false); // Set loading to false in case of an error
    }
  };
  useEffect(() => {
    fetchData();
  }, [auth.id]); // Only depend on auth.id

  const updateContacts = async (newContact) => {
    try {
      // Update the contacts state optimistically
      setContacts((prevContacts) => [...prevContacts, newContact]);

      // Send a request to add the new contact to the server
       await axiosPrivate.put(
        `${USERCONTACTS_URL}/${auth.id}`,
        newContact,
        {
            headers: {
                'Content-Type': 'application/json', 
                withCredentials: true 
            }
        });

      // Data added successfully, no need to update state again
    } catch (error) {
      console.error('Error adding contact:', error);
      // Handle the error, potentially revert the state update if needed
    }
  };


  const fetchPrivateConversation = async (contactId) => {
    const userId = auth.id; // Ensure that you get the user ID here
    console.log(contactId);
  
    try {
      const response = await axiosPrivate.get(PRIVETCONVERSATION_URL);
      const privateConversationsData = response.data;
      console.log(privateConversationsData);
      // Find the conversation where both userId and contactId are members
      const privateConversation = privateConversationsData.find(conversation => {
        return conversation.members.some(member => member._id === userId) &&
               conversation.members.some(member => member._id === contactId);
      });
      console.log(privateConversation);
      setPrivateConverstion(privateConversation);
      console.log(privateConversation);
      
  
      if (!privateConversation) {
        console.log(auth.id, contactId)
        try {
          // Create a new private conversation
          await createPrivateConversation(contactId);
          const response = await axiosPrivate.get(PRIVETCONVERSATION_URL);
          const newConversation = response.data
          console.log(newConversation);
  
          const newConversationId = newConversation._id;
          console.log(newConversationId);
  
          // Update state with the new conversation
          setPrivateConverstion((prevConversations) => {
          const conversationsArray = Array.isArray(prevConversations) ? prevConversations : [];
          [
            ...conversationsArray,
            newConversation,
          ]});
  
          setLoading(false);
  
          return newConversation; // Return the new conversation object
        } catch (createError) {
          console.error('Error creating private conversation:', createError);
          setLoading(false);
          return null;
        }
      } else {
        console.log('Existing private conversation:', privateConversation);
  
        setLoading(false);
  
        return privateConversation; // Return the existing conversation object
      }
    } catch (error) {
      console.error('Error fetching private conversation:', error);
      setLoading(false);
      return null;
    }
  };
  

  const createPrivateConversation = async (contactId) => {
    try {
      // Fetch user information from auth
      const userId = auth.id;
      const userName = auth.user;

      // Fetch contact information based on contactId (assuming you have a function for this)
      const contact =  contacts.find(contact => contactId === contact._id)
      console.log(userId,contact ,userName);
      // Ensure you have the necessary data
      if (!userId || !userName || !contact) {
        console.error('Missing user or contact information.');
        return;
      }
  
      const members = [
        { _id: userId, memberName: userName },
        { _id: contact._id, memberName: contact.contactName },
      ];
  
      // Send a request to add the new contact to the server
      await axiosPrivate.post(
        PRIVETCONVERSATION_URL,
        { members },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      // Data added successfully, no need to update state again
    } catch (error) {
      console.error('Error creating private conversation:', error);
      // Handle the error, potentially revert the state update if needed
    }
  };
  
  const saveMessages = async(id , obj) => {
    console.log(id, obj);
    
      try {
        await axiosPrivate.patch(
          `${PRIVETCONVERSATION_URL}/${id}`,
          obj,
          {
            headers: {
                'Content-Type': 'application/json'
            }, 
          }
        ) 
      } catch (error) {
        console.log(error);
      }
  }

  const handleBlock = async(contactId) => {
    try {
      const respons = await axiosPrivate.get(USERCONTACTS_URL);
      const users = respons.data
      const currentUser = users.find((user) => user._id === userId)
      const checkContactId = currentUser.blockedContacts.includes(contactId);
      console.log(checkContactId);
      if (checkContactId) {
        const updatedBlockedContacts = currentUser.blockedContacts.filter(
          (blockedContact) => blockedContact !== contactId)
          const updatedUser = { ...currentUser, blockedContacts: updatedBlockedContacts };
         try {
          await axios.patch(
            `${USERCONTACTS_URL}/${userId}`,
            updatedUser,
            {
              headers: {
                  'Content-Type': 'application/json'
              }, 
            }
          ) 
         } catch (error) {
          console.log(error);
         }
          
      } else {
        const updatedBlockedContacts = [...currentUser.blockedContacts, contactId];
        const updatedUser = { ...currentUser, blockedContacts: updatedBlockedContacts };
        try {
          await axiosPrivate.patch(
            `${USERCONTACTS_URL}/${userId}`,
            updatedUser,
            {
              headers: {
                  'Content-Type': 'application/json'
              }, 
            }
          ) 
         } catch (error) {
          console.log(error);
         }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ContactsContext.Provider value={{ 
      contacts, 
      privateConversation,
      loading, 
      // contactIsBlocked,
      // userIsBlocked,
      handleBlock,
      // checkBlockedContact,
      fetchData,
      updateContacts, 
      createPrivateConversation, 
      fetchPrivateConversation,
      saveMessages }}>
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsContext;
