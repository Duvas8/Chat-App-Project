  import React, { useState ,useContext, useEffect, useCallback} from 'react'
  import ConvarstionContext from '../context/ConverstionsProvider';
  import ContactsContext from '../context/ContactsProvider'
  import AuthContext from '../context/AuthProvider';
  import SocketContext from '../context/SocketProvider';
  import {VideoCall} from "./VideoCall";
  // import Peer from 'simple-peer';
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
    const [searchText, setSearchText] = useState('');
    const [search, setSearch] = useState('');
    const [matchingMessages, setMatchingMessages] = useState([]);
    const [searchRef, setSearchRef] = useState(null);

    const [inCall, setInCall] = useState(false)
    const [incomingCall, setIncomingCall] = useState(false);
    const [from, setFrom] = useState('')


    const setRef = useCallback(node => {
      if (node) {
        node.scrollIntoView({smooth:true})
      }
    },[])
    

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
      };
      
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
    
    useEffect(() => {
      if (search === '') return
      // Update matching messages when search text changes
      const filteredMessages = messages.filter((message) =>
        message.text.toLowerCase().includes(search.toLowerCase())
      );
      setMatchingMessages(filteredMessages);
    }, [search]);

    useEffect(() => {
      if (searchRef) {
        // Scroll to the most recent message in the search messages
        searchRef.scrollIntoView({ behavior: 'smooth' });
      }
    }, [matchingMessages]);

    const startVideoCall = async (userId) => {
      const fetchedConversation = await currentConversation[0]._id;
      callUser(userId, fetchedConversation);
    };

    const callUser = ( userId, fetchedConversation) => {
      
      setInCall(true)
      console.log(fetchedConversation);
      socket.emit('start-video-call', fetchedConversation , userId)
    }

    useEffect(()=>{
      console.log(socket);
      if(socket == null) return console.log("socket is null");
      socket.on('receive-video-call', (from) => {
        console.log(`${from} calling`);
        setFrom(from)
        setIncomingCall(true)
        
      })
      return () => socket.off('receive-video-call')
    },[incomingCall])

    const answerCall = () => {
      setInCall(true)
      setIncomingCall(false)
    }
    
    useEffect(()=>{
      fetchData()
    },[messages])
    
    
    console.log(currentConversation);
    return (
      <div>
          {currentConversation  ? (
        <div>
            <div className='info-container'>
              <h4 style={{margin:'0'}}>Conversation</h4>
                <h3>Recipient: {recipientName}</h3>
                <div>
                <input type='text' className="textarea" onChange={(e)=> setSearchText(e.target.value)} placeholder='Search Group'></input>
                <button className="send-button" style={{margin:'8px', backgroundColor:"ghostWhite",  color:'cornflowerblue'}} onClick={()=> setSearch(searchText)}> Search Message </button>
                <button className="send-button" style={{margin:'8px', backgroundColor:"ghostWhite",  color:'cornflowerblue'}} onClick={() => startVideoCall(userId)}>Call</button>
                </div>
              </div>

          <div className='container'>  
              <div className='messages-container' >
                {messages.map((msg, index) => (
                <div
                ref={setRef}
                className='message'
                style={{
                  alignItems: msg.sender !== userId ? 'flex-start' : 'flex-end'
                }}
                key={index}
              >
        <div
          className='message-text'
          style={{
          background: msg.sender === userId ? 'lightBlue' : 'ghostWhite'
          }}> <div 
          ref={index === matchingMessages.length - 1 ? setSearchRef : null}
           style={{
            background: matchingMessages.includes(msg)
            ? 'yellow'
            : 'transparent', 
          }}>
            {msg.text}
        </div>
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
          <div  >
            
            {incomingCall && (
                <div className='incoming-call-container'>
                    <h3>Incoming Call from {from}</h3>
                    <button className="send-button" style={{margin:'8px', backgroundColor:"ghostWhite",  color:'cornflowerblue'}} onClick={answerCall}>Answer Call</button>
                </div>
            )}

            {inCall ? (
              <div className='incoming-call-container'>
                <VideoCall setInCall={setInCall} recipientName={recipientName} contactId={memberId} userId={userId} />
                 </div>
              
            ):(null)}
          
        </div>
      </div>
      ) : (
        <div className='info-container'> no recipients</div>
      )}     
      </div>
    )
  }

  export default Conversation
