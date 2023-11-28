import React from 'react'
import { useState, useRef , useEffect, useContext} from "react"
import ContactsContext from "../context/ContactsProvider"
import GroupsContext  from "../context/GroupsProvider";
import '../../styles/modelsStyle.css'


export default function AddContactToGroup({ currentGroup, closeModel }) {
    const { addNewContactToGroup} = useContext(GroupsContext);
    const { contacts } = useContext(ContactsContext);
    console.log(contacts)
    const errRef = useRef();
    
    const [newContacts, setNewContacts] = useState([])
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [errMsg, setErrMsg] = useState('');
   console.log(currentGroup);
   
   useEffect(() => {
    setErrMsg('');
   }, [selectedMembers])

   useEffect(() => {
    setNewContacts(filteredContacts);
    console.log(filteredContacts);
   }, [closeModel])

   const filteredContacts = contacts.map((contact) => {
    const filteredMembers = currentGroup[0].members.filter(member => member.id !== contact._id);
    if (filteredMembers.length === currentGroup[0].members.length) {
      // If no member with matching _id was found, include the contact in the result
      return {
        id: contact._id,
        contactName: contact.contactName,
        phoneNumber: contact.phoneNumber,
      };
    }
    return null; // Exclude the contact from the result
  }).filter(Boolean);

   const handleCheckboxChange = (contactId) => {
    console.log(contactId);
    // Check if the contact is already in the selectedMembers array
    const isAlreadySelected = selectedMembers.some(
      (member) => member._id === contactId
    );
    if (isAlreadySelected) {
      // If it's already selected, remove it from the array
      setSelectedMembers((prevSelected) =>
        prevSelected.filter((member) => member._id !== contactId)
      );
    } else {
      // If it's not selected, add it to the array with the appropriate structure
      setSelectedMembers((prevSelected) => [
        ...prevSelected,
        { _id: contactId },
      ]);
    }
  };
  


   const handleSubmit = async (e) => {
        e.preventDefault();
        if(!selectedMembers){
            setErrMsg('Please fill in all fields.');
            return
        }
        
        const membersArr = [...selectedMembers]
        const addMembers = { members:membersArr}
        console.log(addMembers);
       
        try {
          await addNewContactToGroup(currentGroup[0]._id ,addMembers);
          setSelectedMembers('')
          closeModel()
        } catch (err) {  
            console.log(err)
            if(!err?.resp){
                setErrMsg("No Server Respons")
                console.log(errMsg)
            } else if (err.resp?.status === 409){
                setErrMsg("Id Taken")
                console.log(errMsg)
            }else{
                setErrMsg("Faild To Add Contact")
            }
            errRef.current.focus();
        } 
   }

  return (
    
       <section className='container'>
           <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
           <div>
           <button onClick={closeModel} > Close</button>
           </div>
           <h3>Add New Contact </h3>
           <form>
               <label htmlFor="members">
                   Select Contact:
               </label>
               {newContacts.map((contact, index) =>(
                <div key={index} >
                     <input
                 
                 type="checkbox"
                 onChange={() => handleCheckboxChange(contact.id)}
                 checked={selectedMembers.some((selectedMembers) => selectedMembers._id === contact.id)}
               />
               {contact.contactName}
                </div>
                
               ))}
           </form>
           <div>
           <button onClick={handleSubmit}>Add Contact</button>
           </div>
       </section>
  )
}
