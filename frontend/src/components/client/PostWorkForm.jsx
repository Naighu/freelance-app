import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

const PostWorkForm = ({ jobs, setJobs, editingJob, setEditingJob, setIsModalOpen }) => {
   const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/work/category');
        console.log(response.data);

        setCategories(response.data);
        if(editingJob){
          // Find the category ID using its name
          const matchedCategory = response.data.find(cat => cat.name === editingJob.category);
          console.log(editingJob.category)
          window.setTimeout(() => {
            setFormData({
              title: editingJob.title || '',
              description: editingJob.description || '',
              budget: editingJob.budget || '',
              category_id: matchedCategory._id || '',
            });
          }, 100)
        }
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
        category_id: editingJob.category || '',
      });
    } else {
      setFormData({ title: '', description: '', budget: '', category_id: '' });
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
        category_id: formValues.category_id,
      };
  
      console.log(body);
  
      const response = await axiosInstance.post('/api/work/post', body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // Close modal after success
        window.setTimeout(() => {
          setIsModalOpen(false);
        }, 500);
        window.setTimeout(() => {
          setJobs((prevJobs) => [...prevJobs, response.data]);
        }, 1000);
        setFormError(null)
        setFormSuccess("Success")
      } else {
        setFormError("Unexpected response:", response.status, response.data)
        setFormSuccess(null)
      }
    } catch (error) {
      setFormError('Error posting job:', error.response?.data || error.message)
      setFormSuccess(null)
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
        category_id: formValues.category_id
      }

      const response = await axiosInstance.put('/api/work/update', body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // Close modal after success
        window.setTimeout(() => {
          setIsModalOpen(false);
        }, 500);
        window.setTimeout(() => {
          setJobs((prevJobs) => 
            prevJobs.map((job) => 
              job._id === response.data._id ? response.data : job
            )
          );
        }, 1000);
        setFormError(null)
        setFormSuccess("Success")
      } else {
        setFormError("Unexpected response:", response.status, response.data)
        setFormSuccess(null)
      }
    } catch (error) {
      setFormError('Error updating job:', error.response?.data || error.message)
      setFormSuccess(null)
      console.error('Error updating job:', error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingJob ? 'Edit Job' : 'Add New Job'}</h1>
      {(formError && formError !== '') && <div className='alert alert-danger'>{formError}</div>}
      {(formSuccess && formSuccess !== '') && <div className='alert alert-success'>{formSuccess}</div>}
      <input
        type="text"
        placeholder="Title"
        minLength={3}
        required
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <textarea
        placeholder="Description"
        required
        minLength={10}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Budget"
        required
        min={0}
        value={formData.budget}
        onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Category Dropdown */}
      <select
        required
        value={formData.category_id}
        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
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
