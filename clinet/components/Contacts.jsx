import React, { useContext, useState} from 'react'
import ContactsContext from '../context/ContactsProvider'
import ConvarstionContext from '../context/ConverstionsProvider'
import { ListGroup } from 'react-bootstrap'
import '../../styles/contacts.css'



function Contacts() {
  const { contacts } = useContext(ContactsContext);
  const {openConversation} = useContext(ConvarstionContext)
  const [currentContact, setCurrentContact] = useState(null);
 
  const handleOpenConversation = (contact) => {
      openConversation([contact._id]);  
      setCurrentContact(contact._id);  
  };

  return (
    <section>
      <h2>Contacts</h2>
      <ListGroup className="contact-list">
        {contacts.map((contact, index) => (
          <ListGroup.Item
            key={index}
            onClick={() => handleOpenConversation(contact)}
            className={`contact-item ${currentContact === contact._id ? 'active' : ''}`}
          >
            {contact.contactName}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </section>
  );
}

export default Contacts;