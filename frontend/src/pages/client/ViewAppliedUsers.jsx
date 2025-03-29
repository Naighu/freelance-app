import React, { useState, useEffect } from 'react';
import '../../style/ViewAppliedUsers.css'; // Adjust the path if necessary

// Sample user data (you can fetch this from an API later)
const sampleUsers = [
  {
    id: 1,
    name: 'John Doe',
    budget: '$5000',
    message: 'Looking forward to discussing the project.'
  },
  {
    id: 2,
    name: 'Jane Smith',
    budget: '$3500',
    message: 'Interested in collaboration on new projects.'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    budget: '$8000',
    message: 'Can provide quick results and efficient work.'
  }
];

const ViewAppliedUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // You can replace this with a real API call to fetch data
    setUsers(sampleUsers);
  }, []);

  const handleContact = (userName) => {
    alert(`Contacting ${userName}...`);
  };

  return (
    <div className="user-container">
      <h1>Applied Users</h1>
      <div className="user-cards">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p><strong>Budget:</strong> {user.budget}</p>
            <p><strong>Message:</strong> {user.message}</p>
            <button onClick={() => handleContact(user.name)}>Contact</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAppliedUsers;
