import { useState, useRef , useEffect, useContext} from "react"
import React from 'react'

import ContactsContext from "../context/ContactsProvider"


export default function NewContactsModel({closeModel}) {
    const { updateContacts } = useContext(ContactsContext);
   const contactNameRef = useRef();
   const errRef = useRef();

   const [contactName, setContactName] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [errMsg, setErrMsg] = useState('');
   const [success, setSuccess] = useState(false);
   
   useEffect(() => {
    contactNameRef.current.focus();
   }, [])

   
   useEffect(() => {
    setErrMsg('');
   }, [contactName, phoneNumber])

   const handleSubmit = async (e) => {
        e.preventDefault();
        if(!contactName || !phoneNumber){
            setErrMsg('Please fill in all fields.');
            return
        }
        const newContact = {contactName , phoneNumber}
       
        try {
           await updateContacts(newContact)
            setContactName('')
            setPhoneNumber('')
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
    
       <section>
           <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
           <div>
           <button onClick={closeModel} > Close</button>
           </div>
           <h3>Create New Contact</h3>
           <form>
               <label htmlFor="contactName">
                   Contact Name:
               </label>
               <input
                   type="text"
                   id="contactName"
                   ref={contactNameRef}
                   autoComplete="off"
                   onChange={(e) => setContactName(e.target.value)}
                   value={contactName}
                   required
               />
               <br/>
               <label htmlFor="phoneNumber">
                   Contact Phone Number:
               </label>
               <input
                   type="Number"
                   id="phoneNumber"
                   onChange={(e) => setPhoneNumber(e.target.value)}
                   value={phoneNumber}
                   required
               />
           </form>
           <div>
           <button onClick={handleSubmit}>Add Contact</button>
           </div>
       </section>
  )
}
