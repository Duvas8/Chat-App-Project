import { createContext, useState, useContext, useEffect } from "react";
import AuthContext from '../context/AuthProvider';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from 'axios';

const GROUPS_URL = 'http://localhost:3000/groups';
const GroupsContext = createContext({});

export const GroupsProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate()
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  console.log(auth.id);

  
        const fetchData = async () => {
          const userId = auth.id; // Ensure that you get the user ID here
        console.log(userId);
      try {
        const response = await axiosPrivate.get(GROUPS_URL);
        const groupsData = response.data;
        console.log(groupsData);
        // Filter the groups based on the user's ID
        const filteredGroups = groupsData.filter(group => group.members.some(member => member._id === userId));
        console.log(filteredGroups);
        setGroups(filteredGroups);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setLoading(false);
      }
    };
 
  useEffect(() => {
    fetchData();
  }, [auth.id]);
  


  const addNewGroup = async (newGroup) => {
    try {
      // Update the contacts state optimistically
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      // Send a request to add the new contact to the server
      await axiosPrivate.post(
        GROUPS_URL,
        newGroup,
        {
            headers: {
                'Content-Type': 'application/json'
            }, 
            withCredentials: true,   
        });
      // Data added successfully, no need to update state again
    } catch (error) {
      console.error('Error adding contact:', error);
      // Handle the error, potentially revert the state update if needed
    }
  };

  const saveMessages = async(id , obj) => {
    console.log(id, obj);
    
      try {
        await axiosPrivate.patch(
          `${GROUPS_URL}/${id}`,
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
      fetchData();
  }

  const addNewContactToGroup = async(id, obj) =>{
    console.log(id, obj);
    try {
      await axiosPrivate.patch(
        `${GROUPS_URL}/${id}/addContact`,
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

  const leaveCurrentGroup = async(id, obj) =>{
    console.log(id, obj);
    try {
      const response = await axiosPrivate.patch(
        `${GROUPS_URL}/${id}/leave-Group`,
        obj,
        {
          headers: {
              'Content-Type': 'application/json'
          }, 
        }
      ) 
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <GroupsContext.Provider value={{
      groups,
      loading,
      addNewGroup,
      saveMessages,
      fetchData,
      addNewContactToGroup,
      leaveCurrentGroup
        }}>
      {children}
    </GroupsContext.Provider>
  );
};

export default GroupsContext;
