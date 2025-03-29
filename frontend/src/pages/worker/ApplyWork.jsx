import React, { useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';

const ApplyWorkPage = () => {
    const [applicationAmount, setApplicationAmount] = useState('');
    const [message, setMessage] = useState('');


    const job = {
        title: "Web Developer",
        description: "We are looking for an experienced web developer to build and maintain websites.",
        budget: 1500,
        category: "Technology"
    };

    // Handle form submission
    const handleApply = () => {
        if (!applicationAmount) {
            alert("Please enter an amount.");
            return;

        } 
         if (applicationAmount < 0) {
            alert("Invalid amount");
            return;

        }  if (applicationAmount > job.budget) {
            alert(`Amount should be <= ${job.budget}`);
            return;
        } 

        if(message ===''){
            alert(`Message field should not be empty`);
            return;
        }
    };

        return (
            <div className="container mx-auto p-6">
              {/* Job Card */}
              <div className="bg-white p-6 rounded-md shadow-md mb-6">
                <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{job.description}</p>
                <p className="text-sm text-gray-500 mb-2">Budget: ${job.budget}</p>
                <p className="text-sm text-gray-500 mb-2">Category: {job.category}</p>
              </div>
        
              {/* Apply Section */}
              <div className="bg-white p-6 rounded-md shadow-md">
                <h3 className="text-lg font-semibold mb-4">Apply</h3>
                <div className="flex flex-col space-y-4">
                  <label className="text-sm font-medium">Enter your amount to apply:</label>
                  <div className="flex items-center space-x-2">
                    <FaDollarSign className="text-gray-500" />
                    <input
                      type="number"
                      value={applicationAmount}
                      onChange={(e) => setApplicationAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                  </div>
        
                  {/* Message Input */}
                  <label className="text-sm font-medium">Enter your message:</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Short message to the client"
                    rows="4"
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
        
                  <button
                    onClick={handleApply}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          );
};

export default ApplyWorkPage;
