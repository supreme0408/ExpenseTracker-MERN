import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const NewGroupModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');

  const handleCreateGroup = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.post('http://localhost:5000/api/splitwise/make-group', {
        name,
        members: members.split(',').map((m) => m.trim()),
      },{
        headers:{
          Authorization:`${token}`
        }
      });
      onCreate(response.data);
    } catch (error) {
      console.error('Error creating group', error);
      alert(((error.response).data).message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Create New Group</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group Name"
        />
        <input
          type="text"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          placeholder="Member User IDs (comma separated)"
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>
    </div>
  );
};

export default NewGroupModal;
