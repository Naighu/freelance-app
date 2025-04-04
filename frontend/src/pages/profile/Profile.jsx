import React, { useState } from "react";
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const ProfilePage = () => {
       const { user:loggedUser, login } = useAuth();
  
  const [user, setUser] = useState(loggedUser);
  const [loading,setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave =async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      setFormError(null);
      setFormSuccess(null);

      const body = {
        name: editedUser.name,
        password: editedUser.password
      }

      // Make API request to backend to apply for the job
      let response = await axiosInstance.put('/api/auth/profile', body, {
          headers: {
              Authorization: `Bearer ${user.token}`  // Replace with actual token handling
          }
      });

    setFormSuccess("Profile Updated");
    login(response.data);
    setUser(response.data);

      // Optionally, handle further success logic here (e.g., clear form, navigate)
  } catch (err) {
      setFormError(err.response.data.message || 'Failed to update profile. Please try again later.');
      console.error(err);
  } finally {
      setLoading(false);
  }

    window.setTimeout(() => {
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white shadow-lg rounded-xl">
        {isEditing ? (
          <form className="space-y-4" onSubmit={
            handleSave
          }>
            {(formError && formError !== '') && <div className='alert alert-danger'>{formError}</div>}
            {(formSuccess && formSuccess !== '') && <div className='alert alert-success'>{formSuccess}</div>}
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
              <label className="block text-sm font-medium text-gray-700">Set new password</label>
              <input
                type="password"
                name="password"
                value={editedUser.password}
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
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Save"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-500 badge">{user.user_type.replace(/\b\w/g, (char) => char.toUpperCase())} {user.user_type === "client" ? "💼" : "👨🏻‍💻"}</p>
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