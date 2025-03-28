import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const PostWorkForm = ({ jobs, setJobs, editingJob, setEditingJob }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
    
    };

    fetchCategories();
  }, []);

  // Handle editing case
  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title || '',
        description: editingJob.description || '',
        budget: editingJob.budget || '',
        category: editingJob.category || '',
      });
    } else {
      setFormData({ title: '', description: '', budget: '', category: '' });
    }
  }, [editingJob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postJob(formData, setJobs);
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
      <h1 className="text-2xl font-bold mb-4">{editingJob ? 'Edit Job' : 'Add New Job'}</h1>

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
        required
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Budget"
        required
        value={formData.budget}
        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Category Dropdown */}
      <select
        required
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full mb-4 p-2 border rounded bg-white"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingJob ? 'Update Job' : 'Create Job'}
      </button>
    </form>
  );
};

export default PostWorkForm;
