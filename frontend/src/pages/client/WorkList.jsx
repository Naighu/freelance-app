import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const WorkList = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                console.log(user);
                
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
        fetchJobs();
    }, []);

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

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-center">Posted Work</h1>
            <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className="bg-white p-4 rounded-md shadow-md flex flex-col justify-between">
                            <h2 className="text-lg font-bold">{job.title}</h2>
                            <p className="text-sm text-gray-500">{job.description}</p>
                            <p className="text-sm text-gray-500">Budget: ${job.budget}</p>
                            <p className="text-sm text-gray-500">Category: {job.category}</p>

                            {job.applied && (
                                <p className="text-sm text-gray-500">Applied: {job.applied.length}</p>
                            )}

                            {/* {user && (
                                <div className="flex justify-end mt-2">
                                    <button
                                        disabled={job.applied?.some(applied => applied._id === user?._id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                                    >
                                        {job.applied?.some(applied => applied._id === user?._id) ? 'Applied' : 'Apply'}
                                    </button>
                                </div>
                            )} */}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No jobs available.</p>
                )}
            </div>
        </div>
    );
};

export default WorkList;
