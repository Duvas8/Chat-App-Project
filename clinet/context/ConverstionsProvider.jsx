import { createContext, useState, useContext,useEffect } from "react";
import AuthContext from './AuthProvider';
import GroupsContext from "./GroupsProvider";
import ContactsContext from "./ContactsProvider";
import SocketContext from "./SocketProvider";

const ConverstionsContext = createContext({});

export const ConverstionsProvider = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const { contacts, fetchPrivateConversation } = useContext(ContactsContext)
    const { groups} = useContext(GroupsContext);
    const { socket} = useContext(SocketContext);
    const [conversations, setConversations] = useState([]);
    const [groupConversation, setGroupConversation] = useState([])
    const [isGroupConversation, setIsGroupConversation] = useState(false)
    const [recipientName, setRecipientName] = useState('')
    const [ conversationId, setConversationId] = useState(null)
    const [currentRoom, setCurrentRoom] = useState('')
    
    const userId = auth.id
    useEffect(() => {
        // Handle incoming messages
        socket.on('received-message', (message) => {
            console.log('Received message:', message);
            setGroupConversation((prevGroup) => {
                const updatedGroup = prevGroup.find((group) => group.groupId === message.groupId);
                if (updatedGroup) {
                    return prevGroup.map((group) => (group.groupId === message.groupId ? {
                        ...group,
                        messages: [...group.messages, message],
                    } : group));
                }
                return prevGroup;
            });
        });
        // Handle disconnections
        socket.on('disconnect', () => {
            // Handle disconnection as needed
            console.log('Disconnected from the server');
        });
        // Clean up listeners when the component unmounts
        return () => {
            socket.off('received-message');
            socket.off('disconnect');
        };
    },[setGroupConversation]); 

    useEffect(() => {
        if (contacts.length > 0) {
            const contactId = contacts[0]._id;
            openConversation(contactId);
        }
        // Handle incoming messages
        socket.on('receive-private-message', (message) => {
            console.log('Received message:', message);
            // For private conversations
            setConversations((prevConversations) => {
                const updatedConversation = prevConversations.find((conversation) => {
                    return conversation.privateConversationId === message.privateConversationId;
                });
                 if (updatedConversation) {
                    return prevConversations.map((conversation) => {
                        return conversation.privateConversationId === message.privateConversationId ? {
                            ...conversation,
                            messages: [...conversation.messages, message],
                        } : conversation;
                    });
                }
    
                return prevConversations;
            });
        });
    
        // Handle disconnections
        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });
    
        // Clean up listeners when the component unmounts
        return () => {
            socket.off('receive-private-message');
            socket.off('disconnect');
        };
    }, [setConversations]);
    
    const joinRoom = (conversationId, callback) => {
        if(currentRoom !== conversationId && currentRoom !== undefined){
          console.log(currentRoom)
          socket.emit('leave-current-room', currentRoom, (message) => {
            console.log(message)
          })
        }
        console.log(socket);
        socket.emit('join-room', conversationId, (message, room) => {
          console.log(message);
          console.log(room) // Message from the server
          setCurrentRoom(room)
          if (callback) {
            callback(message);
          }
        });
      }

    const openConversation = async (contactId) => {
            console.log(contactId);
        const matchedContactId = contactId.join("").toString()
            console.log(matchedContactId);
        const privateConversation =  await fetchPrivateConversation(matchedContactId);
            console.log(privateConversation);
            setIsGroupConversation(false);
            const privateConversationId = privateConversation._id
            const conName = privateConversation.members.find((member) => member._id !== userId)
            setRecipientName(conName.memberName)
                console.log(privateConversationId, recipientName);
            setConversations((prevConversations) => {
               return [...prevConversations, privateConversation ]});
             const room =  privateConversationId
                console.log(room);
             joinRoom(room, (message, result) => {
                console.log(`Joined room: ${room}`);
                console.log( result); // The message from the server
            });
      };


    const openGroupConversation = (groupId) => {
      // Ensure groupId is a string
      console.log(groupId);
      const matchedGroupId = groupId.join("").toString()
      const currentGroup = groups.find(group => group._id === matchedGroupId);
      const currentGroupMembers = currentGroup.members.map((member) => {
              console.log(contacts);
          
              // Find contact information based on the member's _id
              const contact = contacts.find((contact) => contact._id === member._id);
              if (!contact) {
                return { id: member._id, name: member.name };
              }
              // Include the contact's ID and name
              const name = (contact && contact.contactName) || member.name;
              return { id: contact._id, name };
            });
            console.log(currentGroupMembers);
      
      const updatedGroup = {
        ...currentGroup,
        members: currentGroupMembers,
      };
      console.log(updatedGroup);
      setIsGroupConversation(true);
      setGroupConversation((prevGroup) => {
          return [...prevGroup, updatedGroup];
      });
  };

    return (
        <ConverstionsContext.Provider value={{ 
            conversations,
            recipientName,
            conversationId,
            groupConversation ,
            isGroupConversation , 
            openConversation,
            openGroupConversation
            }}>
            {children}
        </ConverstionsContext.Provider>
    );
};

export default ConverstionsContext;

