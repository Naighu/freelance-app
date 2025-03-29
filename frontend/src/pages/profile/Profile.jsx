import React, { useState } from "react";
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
       const { user:loggedUser } = useAuth();
  
  const [user, setUser] = useState(loggedUser);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-lg rounded-xl">
        {isEditing ? (
          <form className="space-y-4" onSubmit={
            handleSave
          }>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                minLength={3}
                value={editedUser.name}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <input
                type="text"
                name="userType"
                disabled
                value={editedUser.user_type}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit"
      
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              // onClick={handleSave}
            >
              Save
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-500">{user.user_type}</p>
            <button
              className="mt-4 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;