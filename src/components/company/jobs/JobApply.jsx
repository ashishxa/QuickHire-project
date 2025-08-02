import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { toast } from 'react-toastify';
import { PacmanLoader } from 'react-spinners';
import axios from 'axios';

export default function JobApply() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (!id) {
          toast.error('Job ID is required');
          navigate('/jobs');
          return;
        }

        const jobRef = doc(db, 'jobs', id);
        const jobSnap = await getDoc(jobRef);
        
        if (!jobSnap.exists()) {
          toast.error('Job not found');
          navigate('/jobs');
          return;
        }
        
        setJobData({ id: jobSnap.id, ...jobSnap.data() });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job data:', error);
        toast.error('Error loading job details');
        navigate('/jobs');
      }
    };
    
    fetchJobData();
  }, [id, navigate]);

  const handleResumeChange = (e) => {
    if (e.target.files.length > 0) {
      setResume(e.target.files[0]);
      setResumeName(e.target.files[0].name);
    }
  };

  const uploadResume = async () => {
    if (!resume) return '';
    
    const formData = new FormData();
    formData.append('file', resume);
    formData.append('upload_preset', 'quickHire');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dvywz29d5/image/upload',
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      toast.error('Error uploading resume');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isLogin = sessionStorage.getItem('isLogin');
    if (!isLogin) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (!coverLetter.trim()) {
      toast.error('Please provide a cover letter');
      return;
    }

    setSubmitting(true);
    try {
      let resumeUrl = '';
      if (resume) {
        resumeUrl = await uploadResume();
      }

      const userId = sessionStorage.getItem('userId');
      const userEmail = sessionStorage.getItem('email');
      const userName = sessionStorage.getItem('name');

      const applicationData = {
        jobId: id,
        jobTitle: jobData.jobTitle,
        companyId: jobData.CompanyId,
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        coverLetter: coverLetter,
        resume: resumeUrl,
        status: 'Pending',
        appliedAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'applications'), applicationData);
      
      toast.success('Application submitted successfully!');
      navigate('/jobs');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <PacmanLoader
          color="#00BD56"
          size={30}
          cssOverride={{ display: 'block', margin: '0 auto' }}
          loading={loading}
        />
      </div>
    );
  }

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
              <h1 className="text-white font-weight-bold">Apply for Job</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <a href="/jobs">Jobs</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Apply</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-5">
              <div className="mb-5">
                <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                  <span className="icon-briefcase mr-3"></span>Job Information
                </h3>
                <div className="p-4 border rounded">
                  <div className="mb-3">
                    <strong>Job Title:</strong> {jobData.jobTitle}
                  </div>
                  <div className="mb-3">
                    <strong>Location:</strong> {jobData.location}
                  </div>
                  <div className="mb-3">
                    <strong>Salary:</strong> {jobData.salary}
                  </div>
                  <div className="mb-3">
                    <strong>Experience:</strong> {jobData.experience}
                  </div>
                  <div className="mb-3">
                    <strong>Skills:</strong> {jobData.skills}
                  </div>
                  <div className="mb-3">
                    <strong>Description:</strong> {jobData.description}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                  <span className="icon-paper-plane mr-3"></span>Application Form
                </h3>
                <form onSubmit={handleSubmit} className="p-4 border rounded">
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Cover Letter *</strong>
                    </label>
                    <textarea
                      className="form-control"
                      rows="6"
                      placeholder="Write your cover letter here..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Resume (Optional)</strong>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                    />
                    <small className="text-muted">
                      Accepted formats: PDF, DOC, DOCX (Max 5MB)
                    </small>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/jobs')}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-light p-3 border rounded">
                <h3 className="text-primary mt-3 h5 pl-3 mb-3">Application Tips</h3>
                <div className="px-3">
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="icon-check text-success mr-2"></i>
                      Write a compelling cover letter
                    </li>
                    <li className="mb-2">
                      <i className="icon-check text-success mr-2"></i>
                      Upload an updated resume
                    </li>
                    <li className="mb-2">
                      <i className="icon-check text-success mr-2"></i>
                      Highlight relevant experience
                    </li>
                    <li className="mb-2">
                      <i className="icon-check text-success mr-2"></i>
                      Be specific about your skills
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}