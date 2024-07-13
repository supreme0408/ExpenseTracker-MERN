import React, { useState } from 'react';
import NewGroupModal from './NewGroupModal';

const GroupList = ({ groups, onGroupClick, onGroupCreated }) => {
  const [showModal, setShowModal] = useState(false);

  const handleNewGroup = (newGroup) => {
    onGroupCreated(newGroup);
    setShowModal(false);
  };

  return (
    <div className="group-list">
      <h2>Active Groups</h2>
      <ul>
        {groups.length > 0 ? (
          groups.map((group) => (
            <li key={group._id} onClick={() => onGroupClick(group._id)} style={{padding:'2px',fontFamily:'Poppins',cursor:'pointer'}}>
              {group.name} (ID: {group._id})
            </li>
          ))
        ) : (
          <li>No active groups available.</li>
        )}
      </ul>
      <button onClick={() => setShowModal(true)}>Create New Group</button>
      {showModal && <NewGroupModal onClose={() => setShowModal(false)} onCreate={handleNewGroup} />}
    </div>
  );
};

export default GroupList;
