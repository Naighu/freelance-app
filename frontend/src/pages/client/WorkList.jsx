import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const WorkList = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([{
        _id: '1',
        title: 'WordPress E-commerce Website',
        description: 'Looking for an experienced WordPress developer to create a professional e-commerce website. Must include product catalog, shopping cart, secure payment gateway, and responsive design. Experience with WooCommerce required.',
        budget: 2500,
        category: "App Development",

    }, {
        _id: '2',
        title: 'Mobile App Development',
        description: 'Need a skilled mobile app developer to create a fitness tracking app for iOS and Android. Features include workout tracking, meal planning, progress charts, and social sharing. Must have experience with React Native.',
        budget: 5000,
        category: "App Development",

    }, {
        _id: '3',
        title: 'UI/UX Design for SaaS Platform',
        description: 'Seeking a talented UI/UX designer to redesign our SaaS platform interface. Project includes creating wireframes, prototypes, and final designs. Must have experience with Figma and modern design principles.',
        budget: 3500,
        category: "App Development",

    }]);



    const handleApply = async (jobId) => {

    };

    return (
        <div>
            <h1>Posted Work</h1>
            <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                    <div key={job._id} className="bg-white p-4 rounded-md shadow-md flex flex-col justify-between">
                        <h2 className="text-lg font-bold">{job.title}</h2>
                        <p className="text-sm text-gray-500">{job.description}</p>
                        <p className="text-sm text-gray-500">{job.budget}</p>
                        <p className="text-sm text-gray-500">{job.category}</p>
                        {job.applied && (
                            <p className="text-sm text-gray-500">Applied: {job.applied.length}</p>
                        )}
                        {/* if user is logged in, show the apply button */}
                        {/* {<div className="flex justify-end">
                        <button disabled={job.applied.some(applied => applied._id === user?._id)} onClick={() => handleApply(job._id)} className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"> {job.applied.some(applied => applied._id === user?._id) ? 'Applied' : 'Apply'}</button>
                    </div>} */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkList;