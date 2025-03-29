import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

import '../../style/ViewAppliedUsers.css'; // Adjust the path if necessary
import { useParams } from 'react-router-dom';



const ViewAppliedUsers = () => {
    const { user } = useAuth();
    const {jobId} = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {

    const fetchAppliedUsers = async() => {
        try {
            const response = await axiosInstance.get(`/api/work/get/${jobId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            console.log(response.data);
            setUsers(response.data['applied_users']);
        } catch (err) {
            console.log(err);
            // setError(err.response?.data?.message || 'Failed to fetch work');
        } finally {
            // setLoading(false);
        }
    }
    fetchAppliedUsers()
  }, [jobId,user.token]);

  const handleContact = (userName) => {
    alert(`Contacting ${userName}...`);
  };

  return (
    <div className="user-container">
      <h1>Applied Users</h1>
      <div className="user-cards">
        {users.map((appliedUser) => (
          <div key={appliedUser.user_id._id} className="user-card">
            <h3>{appliedUser.user_id.name}</h3>
            <p><strong>Budget:</strong> {appliedUser.amount}</p>
            <p><strong>Message:</strong> {appliedUser.message}</p>
            <button onClick={() => handleContact(appliedUser.user_id.name)}>Contact</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAppliedUsers;
