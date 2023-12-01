// Groups.js

import React, { useContext, useMemo, useState } from 'react';
import { ListGroup, Placeholder } from 'react-bootstrap';
import GroupsContext from '../context/GroupsProvider';
import ConvarstionContext from '../context/ConverstionsProvider';
import SocketContext from '../context/SocketProvider';
import '../../styles/groups.css'; // Import the CSS file

function Groups() {
  const { groups } = useContext(GroupsContext);
  const { socket } = useContext(SocketContext);
  const { openGroupConversation } = useContext(ConvarstionContext);
  const [currentRoom, setCurrentRoom] = useState('');
  const [searchText, setSearchText] = useState('');

  const joinRoom = (groupId, callback) => {
    if (currentRoom !== groupId) {
      socket.emit('leave-current-room', currentRoom, (message) => {
        console.log(message);
      });
    }

    socket.emit('join-room', groupId, (message, room) => {
      setCurrentRoom(room);
      if (callback) {
        callback(message);
      }
    });
  };

  const handleOpenConversation = (group) => {
    openGroupConversation([group._id]);
    const room = group._id;
    joinRoom(room, (message, result) => {
      console.log(`Joined room: ${room}`);
      console.log(result);
    });
  };
  const filteredGroups = useMemo(() => {
    if (searchText === '') {
      return groups;
    }
  
    return groups.filter((group) =>
      group.groupName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, groups]);
  
  return (
    <section>
      <div className='info-container'>
        <h2>Groups</h2>
          <input type='text' className='textarea' onChange={(e)=> setSearchText(e.target.value)} placeholder='Search Group'></input>     
      </div>
      <div>
      <ListGroup className="group-list">
        {filteredGroups.map((group, index) => (
          <ListGroup.Item
            key={index}
            className={`group-item ${currentRoom === group._id ? 'active' : ''}`}
            onClick={() => handleOpenConversation(group)}
          >
            {group.groupName}
          </ListGroup.Item>
        ))}
      </ListGroup>
      </div>
    </section>
  );
}

export default Groups;



