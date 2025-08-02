import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { toast } from 'react-toastify';
import { PacmanLoader } from 'react-spinners';

export default function UserApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        if (!applicationId) {
          setError('Application ID is required');
          setLoading(false);
          return;
        }

        // Fetch application data
        const applicationRef = doc(db, 'applications', applicationId);
        const applicationSnap = await getDoc(applicationRef);
        
        if (!applicationSnap.exists()) {
          setError('Application not found');
          setLoading(false);
          return;
        }
        
        const applicationData = { id: applicationSnap.id, ...applicationSnap.data() };
        setApplication(applicationData);
        
        // Fetch job data
        if (applicationData.jobId) {
          try {
            const jobRef = doc(db, 'jobs', applicationData.jobId);
            const jobSnap = await getDoc(jobRef);
            if (jobSnap.exists()) {
              setJobData({ id: jobSnap.id, ...jobSnap.data() });
            }
          } catch (error) {
            console.error('Error fetching job data:', error);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching application details:', error);
        setError('Error loading application details');
        setLoading(false);
      }
    };
    
    fetchApplicationDetails();
  }, [applicationId]);

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

  if (error || !application) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="alert alert-danger">
              <h4>Error</h4>
              <p>{error || 'Application not found'}</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/applications')}
              >
                Back to Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'badge-secondary',
      'Under Review': 'badge-info',
      'Shortlisted': 'badge-warning',
      'Rejected': 'badge-danger',
      'Hired': 'badge-success'
    };
    return `badge ${statusClasses[status] || 'badge-secondary'}`;
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
              <h1 className="text-white font-weight-bold">Application Details</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <a href="/applications">My Applications</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Details</strong></span>
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
                  <span className="icon-align-left mr-3"></span>Application Information
                </h3>
                <div className="p-4 border rounded">
                  <div className="mb-3">
                    <strong>Job Title:</strong> {application.jobTitle || jobData?.jobTitle || 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong>Applied On:</strong> {application.appliedAt ? new Date(application.appliedAt.seconds * 1000).toLocaleString() : 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong> 
                    <span className={`ml-2 ${getStatusBadge(application.status)}`}>
                      {application.status || 'Pending'}
                    </span>
                  </div>
                  {application.resume && (
                    <div className="mb-3">
                      <strong>Resume:</strong> 
                      <a href={application.resume} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm ml-2">
                        View Resume
                      </a>
                    </div>
                  )}
                  {application.coverLetter && (
                    <div className="mb-3">
                      <strong>Cover Letter:</strong>
                      <div className="p-3 bg-light mt-2 border rounded">
                        {application.coverLetter}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {jobData && (
                <div className="mb-5">
                  <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                    <span className="icon-briefcase mr-3"></span>Job Information
                  </h3>
                  <div className="p-4 border rounded">
                    <div className="mb-3">
                      <strong>Title:</strong> {jobData.jobTitle || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Location:</strong> {jobData.location || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Salary:</strong> {jobData.salary || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Experience:</strong> {jobData.experience || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Skills:</strong> {jobData.skills || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Description:</strong> {jobData.description || 'N/A'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="bg-light p-3 border rounded">
                <h3 className="text-primary mt-3 h5 pl-3 mb-3">Navigation</h3>
                <div className="px-3">
                  <button 
                    className="btn btn-block btn-primary mb-2"
                    onClick={() => navigate('/applications')}
                  >
                    Back to Applications
                  </button>
                  <button 
                    className="btn btn-block btn-info mb-2"
                    onClick={() => navigate('/jobs')}
                  >
                    Browse More Jobs
                  </button>
                  <button 
                    className="btn btn-block btn-success mb-2"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 