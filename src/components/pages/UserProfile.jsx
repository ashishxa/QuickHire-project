import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    skills: '',
    experience: '',
    education: ''
  });

  useEffect(() => {
    // Load user data from session storage
    const name = sessionStorage.getItem('name') || '';
    const email = sessionStorage.getItem('email') || '';
    const contact = sessionStorage.getItem('contact') || '';
    const address = sessionStorage.getItem('address') || '';
    const skills = sessionStorage.getItem('skills') || '';
    const experience = sessionStorage.getItem('experience') || '';
    const education = sessionStorage.getItem('education') || '';

    setUserData({
      name,
      email,
      contact,
      address,
      skills,
      experience,
      education
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        toast.error('User not found');
        return;
      }

      // Update user data in Firebase
      await updateDoc(doc(db, 'users', userId), {
        name: userData.name,
        contact: userData.contact,
        address: userData.address,
        skills: userData.skills,
        experience: userData.experience,
        education: userData.education,
        updatedAt: new Date()
      });

      // Update session storage
      sessionStorage.setItem('name', userData.name);
      sessionStorage.setItem('contact', userData.contact);
      sessionStorage.setItem('address', userData.address);
      sessionStorage.setItem('skills', userData.skills);
      sessionStorage.setItem('experience', userData.experience);
      sessionStorage.setItem('education', userData.education);
      
      // Update the user object in sessionStorage
      const existingUser = sessionStorage.getItem('user');
      if (existingUser) {
        const userObject = JSON.parse(existingUser);
        const updatedUserObject = {
          ...userObject,
          name: userData.name,
          contact: userData.contact,
          address: userData.address,
          skills: userData.skills,
          experience: userData.experience,
          education: userData.education
        };
        sessionStorage.setItem('user', JSON.stringify(updatedUserObject));
      }

      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: 'url(/assets/images/hero_1.jpg)' }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Edit Profile</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <a href="/dashboard">Dashboard</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Profile</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h3 className="mb-0">Profile Information</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="label">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={userData.email}
                            disabled
                          />
                          <small className="text-muted">Email cannot be changed</small>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="label">Contact Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="contact"
                            value={userData.contact}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={userData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="label">Skills</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="skills"
                        value={userData.skills}
                        onChange={handleInputChange}
                        placeholder="Enter your skills (e.g., JavaScript, React, Python, etc.)"
                      />
                    </div>

                    <div className="form-group">
                      <label className="label">Experience</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="experience"
                        value={userData.experience}
                        onChange={handleInputChange}
                        placeholder="Describe your work experience"
                      />
                    </div>

                    <div className="form-group">
                      <label className="label">Education</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="education"
                        value={userData.education}
                        onChange={handleInputChange}
                        placeholder="Enter your educational background"
                      />
                    </div>

                    <div className="form-group text-center">
                      <button
                        type="submit"
                        className="btn btn-primary px-5"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary px-5 ml-3"
                        onClick={() => navigate('/dashboard')}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 