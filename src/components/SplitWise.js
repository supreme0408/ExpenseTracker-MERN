import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import "../style-css/style-splitwise.css";
import GroupList from './Group_Components/GroupList';
import GroupDetails from './Group_Components/GroupDetails';

const SplitWise = ()=>{
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    // Fetch groups for the current user
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/splitwise/my-groups',{
          headers:{
            Authorization:`${token}`
          }
        });
        const midData=(response.data).groupDetails;
        setGroups(midData);
        console.log('Fetched groups:', midData); // Log the fetched groups
      } catch (error) {
        console.error('Error fetching groups', error);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (groupId) => {
    setSelectedGroup(groupId);
  };

  const handleGroupCreated = (newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

    return (
        <>
            <div class="text">SplitWise</div>
      <div className="card">
        <div className="card-body">
        <GroupList groups={groups} onGroupClick={handleGroupClick} onGroupCreated={handleGroupCreated} />
        {selectedGroup && <GroupDetails groupId={selectedGroup} />}
        </div>
      </div>
        </>
    );
}

export default SplitWise;