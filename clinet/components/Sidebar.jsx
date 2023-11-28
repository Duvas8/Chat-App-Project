import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import { Tab, Nav } from 'react-bootstrap';
import Contacts from './Contacts';
import Groups from './Groups';
import NewGroupModel from "./NewGroupModel";
import NewContactsModel from "./NewContactsModel";
import '../../styles/sidebar.css';

const GROUPS_KEY = 'groups';
const CONTACTS_KEY = 'contacts';

function Sidebar() {
  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('groups');
  const [modelOpen, setModelOpen] = useState(false)
  const groupsOpen = activeTab === GROUPS_KEY

  const closeModel = () => {
    setModelOpen(false)
  }
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  return (
    <section className="chat-sidebar">
      <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
        <Nav className="chat-nav">
          <Nav.Item>
            <Nav.Link
              className={`chat-nav-link ${activeTab === 'groups' ? 'active' : ''}`}
              eventKey={GROUPS_KEY}
            >
              Groups
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`chat-nav-link ${activeTab === 'contacts' ? 'active' : ''}`}
              eventKey={CONTACTS_KEY}
            >
              Contacts
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="chat-tab-content">
          {activeTab === 'groups' ? (
            <Tab.Pane>
              <Groups />
            </Tab.Pane>
          ) : (
            <Tab.Pane>
              <Contacts />
            </Tab.Pane>
          )}
        </Tab.Content>
        <div className="chat-user-info">
          <span>{auth.user}</span>
        </div>
        <button className="chat-add-button" onClick={() => setModelOpen(true)}>
          Add New {groupsOpen ? "Groups" : "Contacts"}
        </button>
      </Tab.Container>
      {modelOpen === true ? (
        <div className="chat-model-container">
          {groupsOpen ? <NewGroupModel closeModel={closeModel} /> : <NewContactsModel closeModel={closeModel} />}
        </div>
      ) : null}
    </section>
  );
}

export default Sidebar;
