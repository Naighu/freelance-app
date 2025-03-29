import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

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
      try {
        const response = await axiosInstance.get('/api/work/category');
        console.log(response.data);

        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error.response?.data || error.message);
      }
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
    if (editingJob) {
     await editJob(formData,setJobs)
    } else {
      await postJob(formData, setJobs);
    }
  };

  const postJob = async (formValues, setJobs) => {
    try {
      const body = {
        title: formValues.title,
        description: formValues.description,
        budget: formValues.budget,
        category_id: formValues.category._id
      }
      const response = await axiosInstance.post('/api/work/post', {
        headers: { Authorization: `Bearer ${user.token}` },
        data: body
      });
      setJobs((prevJobs) => [...prevJobs, response.data]);
    } catch (error) {
      console.error('Error posting job:', error.response?.data || error.message);
    }
  };

  const editJob = async (formValues, setJobs) => {
    
    try {
      
      const body = {
        work_id: editingJob._id,
        title: formValues.title,
        description: formValues.description,
        budget: formValues.budget,
        category_id: formValues.category._id
      }
      const response = await axiosInstance.put('/api/work/update',body, {
        headers: { Authorization: `Bearer ${user.token}` },
      });


     setJobs((prevJobs) => 
      prevJobs.map((job) => 
        job._id === response.data._id ? response.data : job
      )
    );
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
