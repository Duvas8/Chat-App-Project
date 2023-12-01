import React, { useState, useContext, useEffect } from 'react'
import ConvarstionContext from '../context/ConverstionsProvider'
import AuthContext from '../context/AuthProvider';
import SocketContext from '../context/SocketProvider'
import GroupsContext  from "../context/GroupsProvider";
import AddContactToGroup from './AddContactToGroup';
import '../../styles/conversationStyle.css'; 


function GroupsConversation() {
    const { auth } = useContext(AuthContext);
    const {saveMessages, fetchData, leaveCurrentGroup} = useContext(GroupsContext);
    const {groupConversation} = useContext(ConvarstionContext)
    const {socket} = useContext(SocketContext)
    const [messages, setMessages] = useState([]);
    const [currentConversation , setCurrentConversation] = useState(null)
    const [text, setText] = useState('')
    const [modelOpen, setModelOpen] = useState(false)

    const userId = auth.id

    const closeModel = () => {
      setModelOpen(false)
    }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newMessage = {text, sender:userId}
    const groupIdRoom = currentConversation[0]._id;
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log(newMessage);
    console.log(currentConversation);
    socket.emit('send-message', groupIdRoom ,newMessage);
    await saveMessages(groupIdRoom, [newMessage]);
    setText('')
  }

  useEffect(() => {
    console.log(groupConversation);
    const lastConversation = groupConversation.slice(-1);
    if (lastConversation.length > 0 && lastConversation[0].messages) {
      setCurrentConversation(lastConversation);
      setMessages(lastConversation[0].messages);
    }
  }, [groupConversation]);

  useEffect(()=>{
    console.log(socket);
    if(socket == null) return
    socket.on('receive-message', (message) => {
      console.log(message);
      setMessages([...messages, message])
    })
    return () => socket.off('receive-message')
  },[socket, messages])
  
  const leaveGroup = async(currentConversation, userId) => {
    console.log(userId);
    const conversationId = currentConversation[0]._id;
    
      const filteredMembers = currentConversation[0].members.filter((member) => member.id !== userId);
    
    console.log(filteredMembers);
    await leaveCurrentGroup(conversationId, filteredMembers)
  }

  useEffect(()=>{
    fetchData()
  },[messages])


  return (
    <div >
        {currentConversation  ? (
          
       <div >
        {currentConversation.map((conv , index)=> (
          <div className='info-container' key={index}>
            <h4>Conversation</h4>
            <br/>
            <span>
            <button className="chat-add-button" onClick={() => setModelOpen(true)}>
             Add contact
            </button>
            <button className="chat-leave-button" onClick={() => leaveGroup(currentConversation, userId)}>
              Leave group
            </button>
            </span>
            
            {modelOpen === true ? (
        <div className="chat-model-container">
           <AddContactToGroup currentGroup={currentConversation} closeModel={closeModel} /> 
        </div>
      ) : null}
          <h3>Group Name: {conv.groupName}</h3>
       </div>
        ))}
          
        <div className='container'>
          {currentConversation.map((conv , index)=> (
            
          <div className='messages-container' key={index} >
            {messages.map((msg, index) => (
                <div
                className='message'
                style={{
                  alignItems: msg.sender !== userId ? 'flex-start' : 'flex-end',
                }}
                key={index}
              >
                <div
                   className={`message-text ${
                    conv.sender === userId ? 'message-text-other' : ''
                  }`}
                  style={{
                    background: msg.sender === userId ? 'lightBlue' : 'ghostWhite'
                  }}
                >
                  {msg.text}
                </div>
                <div
                  className="message-sender"
                >
                {msg.sender === userId ?
                 'You' : 
                 (conv.members.find(
                  (member) => member.id === msg.sender
                    )
                    ?.name || 'Unknown'
                  )
                }
                </div>
              </div>
            ))}
          </div>
        ))}
          </div>
        <div>
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
              <button className="send-button" onClick={handleSubmit}>
                send
              </button>
           </div>
           </form>
        </div>
     </div>
    ) : (
      <div className='info-container'> no recipients</div>
    )}  
    </div>
  )
}

export default GroupsConversation
