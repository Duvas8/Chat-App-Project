// Groups.js

import React, { useContext, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import GroupsContext from '../context/GroupsProvider';
import ConvarstionContext from '../context/ConverstionsProvider';
import SocketContext from '../context/SocketProvider';
import '../../styles/groups.css'; // Import the CSS file

function Groups() {
  const { groups } = useContext(GroupsContext);
  const { socket } = useContext(SocketContext);
  const { openGroupConversation } = useContext(ConvarstionContext);
  const [currentRoom, setCurrentRoom] = useState('');

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

  return (
    <section>
      <h2>Groups</h2>
      <ListGroup className="group-list">
        {groups.map((group, index) => (
          <ListGroup.Item
            key={index}
            className={`group-item ${currentRoom === group._id ? 'active' : ''}`}
            onClick={() => handleOpenConversation(group)}
          >
            {group.groupName}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </section>
  );
}

export default Groups;



