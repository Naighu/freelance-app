import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const PostWorkForm = ({ jobs, setJobs, editingJob, setEditingJob }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', budget: null,category : '' });

  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title,
        description: editingJob.description,
        amount: editingJob.amount,
        rating: editingJob.rating,
        tags: editingJob.tags,
      });
    } else {
      setFormData({ title: '', description: '', amount: 0, rating: 1, tags: '' });
    }
  }, [editingJob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postJob(formValues, setJobs);
  };

  const postJob = async (formValues, setJobs) => {
    try {
      const response = await axiosInstance.post('/api/work/post', formValues);
      setJobs((prevJobs) => [...prevJobs, response.data]);
    } catch (error) {
      console.error('Error posting job:', error.response?.data || error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingJob ? 'Edit Job' : 'Add new job'}</h1>
      <input
        type="text"
        placeholder="Title"
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        required
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Budget"
        required
        value={formData.budget}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
     
      <input
        type="string"
        placeholder="Category"
        required
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingJob ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default PostWorkForm;