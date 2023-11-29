import React from 'react'
import { useState, useRef , useEffect, useContext} from "react"
import ContactsContext from "../context/ContactsProvider"
import GroupsContext  from "../context/GroupsProvider";
import AuthContext from '../context/AuthProvider';
import '../../styles/modelsStyle.css'


const NewGroupModel = ({closeModel}) =>{
    const { auth } = useContext(AuthContext); 
    const {addNewGroup} = useContext(GroupsContext);
    const { contacts } = useContext(ContactsContext);
    console.log(contacts)
    const groupNameRef = useRef();
    const errRef = useRef();


   const [groupName, setGroupName] = useState('');
   const [selectedMembers, setSelectedMembers] = useState([]);
   const [errMsg, setErrMsg] = useState('');
   
   useEffect(() => {
    groupNameRef.current.focus();
   }, [])

   
   useEffect(() => {
    setErrMsg('');
   }, [groupName, selectedMembers])

   const handleCheckboxChange = (contactId) => {
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
        if(!groupName || !selectedMembers){
            setErrMsg('Please fill in all fields.');
            return
        }
        
        const membersArr = [...selectedMembers, {_id: auth.id}]
        const newGroup = {groupName , members:membersArr}
        console.log(newGroup);
       
        try {
          await addNewGroup(newGroup);
          setGroupName('')
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
           <h3>Create New Group</h3>
           <form>
               <label htmlFor="groupName">
                   Group Name:
               </label>
               <input
                   type="text"
                   id="groupName"
                   ref={groupNameRef}
                   autoComplete="off"
                   onChange={(e) => setGroupName(e.target.value)}
                   value={groupName}
                   required
               />
               <br/>
               <label htmlFor="members">
                   Select Group Members:
               </label>
               {contacts.map((contact, index) =>(
                <div key={index}>
                     <input
                 
                 type="checkbox"
                 onChange={() => handleCheckboxChange(contact._id)}
                 checked={selectedMembers.some((selectedMembers) => selectedMembers._id === contact._id)}
               />
               {contact.contactName}
                </div>
                
               ))}
              

           </form>
           <div>
           <button onClick={handleSubmit}>Create New Group</button>
           </div>
       </section>
  )
}

export default  NewGroupModel
