import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';
import PostWorkForm from '../../components/client/PostWorkForm';

const WorkList = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingJob, setEditingJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchJobs = async () => {


            try {
                const response = await axiosInstance.get('/api/work/get', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                console.log(response.data);
                setJobs(response.data);
            } catch (err) {
                console.log(err);
                setError(err.response?.data?.message || 'Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        };

        //This function gets all the works without having the JWT token
        const fetchAllWorks = async () => {
            try {
                const response = await axiosInstance.get('/api/work/get/all');
                setJobs(response.data);
            } catch (err) {
                console.log(err);
                setError(err.response?.data?.message || 'Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        }
        if (!user) {
            fetchAllWorks()
        }else{
            fetchJobs();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading jobs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-10 text-red-600 font-semibold">
                {error}
            </div>
        );
    }

    const handleEdit = (job) => {
        setEditingJob(job)
        setIsModalOpen(true)
    };

    console.log(user);


    const handleDelete = async (jobId) => {
        if (!user) return;
        if (!window.confirm('Are you sure you want to delete this work?')) return;

        try {
            await axiosInstance.delete(`/api/work/delete`, {
                headers: { Authorization: `Bearer ${user.token}` },
                data: { work_id: jobId }
            });
            setJobs(jobs.filter((job) => job._id !== jobId));
        } catch (err) {
            console.error('Failed to delete job:', err);
        }
    };
    return (
        <div className='pt-4'>
            <h1 className="text-2xl font-bold mb-4 text-center">{ (user && user.user_type === "client") ? "Posted Works" : "Available Works"}</h1>
            {/* {editingJob && (
                <PostWorkForm
                    editingJob={editingJob}
                    setEditingJob={setEditingJob}
                    jobs={jobs}
                    setJobs={setJobs}
                />
            )} */}
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                onClick={() => setIsModalOpen(false)} // Close when clicking outside
                >
                <div className="bg-white p-6 rounded shadow-lg w-96 relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    {/* Close Button */}
                    <button
                    className="absolute top-2 right-2"
                    onClick={() => setIsModalOpen(false)}
                    >
                    ✕
                    </button>

                    {/* Job Form */}
                    <PostWorkForm
                    editingJob={editingJob}
                    setEditingJob={setEditingJob}
                    setIsModalOpen={setIsModalOpen}  // Pass modal control function
                    jobs={jobs}
                    setJobs={setJobs}
                    />
                </div>
                </div>
            )}
            <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <Link
                        to={ !user? '/login':  user.user_type ==='client'? `/work/view-applied/${job._id}` : `/work/apply/${job._id}`} 
                        key={job._id}
                        className="bg-white rounded-md shadow-md flex flex-col justify-between"
                    >
                        <div key={job._id} className="bg-white p-4 rounded-md shadow-md flex flex-col justify-between">
                           
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold">{job.title}</h2>
                                {(user && user.user_type === "client") && (
                                    <div className="flex space-x-2">
                                        <FaEdit
                                            className="text-blue-500 cursor-pointer hover:text-blue-700"
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent Link navigation
                                                e.stopPropagation(); // Stop event bubbling
                                                handleEdit(job)
                                            }}
                                        />
                                        <FaTrash
                                            className="text-red-500 cursor-pointer hover:text-red-700"
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent Link navigation
                                                e.stopPropagation(); // Stop event bubbling
                                                handleDelete(job._id)
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold">{job.title}</h2>
                                    {user && (
                                        <div className="flex space-x-2">
                                            <FaEdit
                                                className="text-blue-500 cursor-pointer hover:text-blue-700"
                                                onClick={() => handleEdit(job)}
                                            />
                                            <FaTrash
                                                className="text-red-500 cursor-pointer hover:text-red-700"
                                                onClick={() => handleDelete(job._id)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-gray-500">{job.description}</p>
                                <p className="text-sm text-gray-500">Budget: ${job.budget}/- 💸</p>
                                <p className="text-sm text-gray-500 mt-2"><span className='badge'>{job.category}</span></p>

                                {job.applied && (
                                    <p className="text-sm text-gray-500">Applied: {job.applied.length}</p>
                                )}
                            </div>
                        </Link>

                    ))
                ) : user.user_type === 'client' ? (
                    <Link
                    to="/post-work"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 block text-center"
                  >
                    Post Work
                  </Link>
                ) : (
                    <p className="text-center text-gray-600">No jobs available.</p>
                )}
            </div>
            { (user && user.user_type === "client") &&
            <div className='text-center w-100'>
            <button onClick={() => {
                setEditingJob(null)
                setIsModalOpen(true)
                }}>Post New Job</button>
            </div>
            }
        </div>
    );
};

export default WorkList;
