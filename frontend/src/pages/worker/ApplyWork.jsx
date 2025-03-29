import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { FaDollarSign } from 'react-icons/fa';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';


const ApplyWorkPage = () => {
    
    const { jobId } = useParams();
    console.log(useParams());
    
     const { user } = useAuth();
     const [work, setWork] = useState(null);
    const [applicationAmount, setApplicationAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [error, setError] = useState('');


    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/work/get/${jobId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                console.log(response.data);
                
                setWork(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [jobId]);
  
    // Handle form submission
    const handleApply =async () => {
        if (!applicationAmount) {
            alert("Please enter an amount.");
            return;

        } 
         if (applicationAmount < 0) {
            alert("Invalid amount");
            return;

        }  if (applicationAmount > work.budget) {
            alert(`Amount should be <= ${work.budget}`);
            return;
        } 

        if(message ===''){
            alert(`Message field should not be empty`);
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Prepare the application data
            const applicationData = {
                work_id: work._id,
                amount: applicationAmount,
                message: message
            };

            // Make API request to backend to apply for the job
            const response = await axiosInstance.post('/api/work/apply', applicationData, {
                headers: {
                    Authorization: `Bearer ${user.token}`  // Replace with actual token handling
                }
            });

            alert('Application submitted successfully!');
            // Optionally, handle further success logic here (e.g., clear form, navigate)
        } catch (err) {
            setError('Failed to submit application. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading work details...</p>
            </div>
        );
    }

        return  (
            <div className="container mx-auto p-6">
                {/* Job Card */}
                <div className="bg-white p-6 rounded-md shadow-md mb-6">
                    <h2 className="text-xl font-bold mb-2">{work.title}</h2>
                    <p className="text-sm text-gray-500 mb-2">{work.description}</p>
                    <p className="text-sm text-gray-500 mb-2">Budget: ${work.budget}</p>
                    <p className="text-sm text-gray-500 mb-2">Category: {work.category}</p>
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
                                onChange={(e) => setApplicationAmount(parseFloat(e.target.value) || 0)}
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
    
                        {/* Error Message */}
                        {error && <p className="text-red-600 text-sm">{error}</p>}
    
                        <button
                            onClick={handleApply}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        );
};

export default ApplyWorkPage;
