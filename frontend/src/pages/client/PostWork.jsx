import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

import PostWorkForm from '../../components/client/WorkForm'



const PostWork = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([
    {
      _id: '1',
      title: 'WordPress E-commerce Website',
      description: 'Looking for an experienced WordPress developer to create a professional e-commerce website. Must include product catalog, shopping cart, secure payment gateway, and responsive design. Experience with WooCommerce required.',
      amount: 2500,
      rating: 5,
      tags: 'WordPress, WooCommerce, E-commerce, Web Development',
      applied: [{
        _id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
      }, {
        _id: '2',
        name: 'Jane Doe',
        email: 'jane@doe.com',
      }]
    }, {
      _id: '2',
      title: 'Mobile App Development',
      description: 'Need a skilled mobile app developer to create a fitness tracking app for iOS and Android. Features include workout tracking, meal planning, progress charts, and social sharing. Must have experience with React Native.',
      amount: 5000,
      rating: 4,
      tags: 'React Native, Mobile Development, iOS, Android',
      applied: [{
        _id: '3',
        name: 'John Doe',
        email: 'john@doe.com',
      }]
    }
  ]);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
     
    };

    fetchTasks();
  }, [user]);

  

  

  return (
    <div className="container mx-auto p-6">
      <PostWorkForm
        jobs={jobs}
        setJobs={setJobs}
        editingJob={editingJob}
        setEditingJob={setEditingJob}
      />
      {/* <TaskList jobs={jobs} setJobs={setJobs} setEditingJob={setEditingJob} /> */}
    </div>
  );
};

export default PostWork;