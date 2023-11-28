import React, { useState ,useContext, useEffect, useCallback} from 'react'
import ConvarstionContext from '../context/ConverstionsProvider';
import ContactsContext from '../context/ContactsProvider'
import AuthContext from '../context/AuthProvider';
import SocketContext from '../context/SocketProvider'
import axios from 'axios';
import '../../styles/conversationStyle.css'; 


const USERS_URL = 'http://localhost:3000/users';

function Conversation() {
  const { auth } = useContext(AuthContext);
  const {conversations, recipientName} = useContext(ConvarstionContext)
  const {saveMessages, fetchData ,handleBlock} = useContext(ContactsContext);
  const [messages, setMessages] = useState([]);
  const {socket} = useContext(SocketContext)
  const [currentConversation , setCurrentConversation] = useState(null)
  const [text, setText] = useState('')
  const [contactIsBlocked, setContactIsBlocked] = useState(false)
  const [userIsBlocked, setUserIsBlocked] = useState(false)
  const [memberId, setMemberId] = useState(null)

  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({smooth:true})
    }
  },[])
  //const lastMessage = currentConversation.messages.length - 1 === index

  const userId = auth.id

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {text, sender:userId}
    const conversationsIdRoom = currentConversation[0]._id;
    console.log(conversationsIdRoom);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log(newMessage);
    socket.emit('send-private-message', conversationsIdRoom ,newMessage);
    saveMessages(conversationsIdRoom, [newMessage]);
    setText('')
  }
  useEffect(() => {
    console.log(conversations);
    const lastConversation = conversations.slice(-1);
    if (lastConversation.length > 0 && lastConversation[0].messages) {
      setCurrentConversation(lastConversation);
      setMessages(lastConversation[0].messages);
      const contact = lastConversation[0].members.find((member) => member._id !== userId);
      const contactId = contact._id
      setMemberId(contactId)
      checkBlockedContact(contactId)
    }
    return () => {
      // Cleanup function for socket event subscription
      if (socket) {
        socket.off('receive-private-message');
      }
    };z
    
  }, [conversations]);
  
  
  useEffect(()=>{
    console.log(socket);
    if(socket == null) return
    socket.on('receive-private-message', (message) => {
      console.log(message);
      setMessages([...messages, message])
      
    })
    return () => socket.off('receive-private-message')
  },[messages])

  const handleBlockContact = async() => {
    try {
      await handleBlock(memberId);
      await checkBlockedContact(memberId);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(contactIsBlocked, userIsBlocked);

  const checkBlockedContact = async (contactId) => {
    console.log(contactId);
    try {
      const response = await axios.get(USERS_URL);
      const users = response.data;
      const currentUser = users.find((user) => user._id === userId);
      const contactUser = users.find((user) => user._id === contactId);
      const checkContactId = currentUser.blockedContacts.includes(contactId);
      const checkUserId = contactUser.blockedContacts.includes(userId);
      if (checkContactId && !checkUserId) {
        setContactIsBlocked(true);
        setUserIsBlocked(false);
      } else if (checkUserId && !checkContactId) {
        setUserIsBlocked(true);
        setContactIsBlocked(false);
      } else if (checkContactId && checkUserId) {
        setUserIsBlocked(true);
        setContactIsBlocked(true);
      } else {
        setContactIsBlocked(false);
        setUserIsBlocked(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  useEffect(()=>{
    fetchData()
  },[messages])
  
 
  
  console.log(currentConversation);
  return (
    <div>
        {currentConversation  ? (
       <div>
          <div className='info-container'>
            <h4>Conversation</h4>
            <br/>
              <h3>Recipient: {recipientName}</h3>
            </div>

        <div className='container'>  
            <div>
              {messages.map((msg, index) => (
                
     <div
     ref={setRef}
        className='message'
        style={{
          alignItems: msg.sender !== userId ? 'flex-start' : 'flex-end',
        }}
        key={index}>
      <div
        className='message-text'
        style={{
        background: msg.sender === userId ? 'lightBlue' : 'ghostWhite'
        }}>
        {msg.text}
      </div>
          <div className="message-sender">
              {msg.sender === userId ? 'You' : recipientName}
          </div>
      </div>
      ))}
    </div>
        </div>
          <form>
            <div className="textarea-container">
              <textarea
                   className='textarea'
                   type="text"
                   id="textMessage"
                   onChange={(e) => setText(e.target.value)}
                   value={text}
                   required
                 />
               <br/>
              <div>
           <button className="send-button" disabled={userIsBlocked} onClick={handleSubmit}>Send</button>
          </div>
           <div>
            <button 
            className="send-button"
            style={{
              background: contactIsBlocked ? 'lightgreen' : 'cornflowerblue',
              margin: '3px'
                }} 
                onClick={handleBlockContact}>
                  {contactIsBlocked ? 'unblock' : 'Block'}
              </button>
           </div>
          </div>     
        </form>      
     </div>
    ) : (
      <div className='info-container'> no recipients</div>
    )}     
    </div>
  )
}

export default Conversation