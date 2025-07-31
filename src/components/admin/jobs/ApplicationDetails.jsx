import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { toast } from 'react-toastify';
import { PacmanLoader } from 'react-spinners';

export default function ApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [application, setApplication] = useState(null);
  const [userData, setUserData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [status, setStatus] = useState('');
  
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        // Fetch application data
        const applicationRef = doc(db, 'applications', applicationId);
        const applicationSnap = await getDoc(applicationRef);
        
        if (!applicationSnap.exists()) {
          toast.error('Application not found');
          navigate('/admin/jobs/viewapplication');
          return;
        }
        
        const applicationData = { id: applicationSnap.id, ...applicationSnap.data() };
        setApplication(applicationData);
        setStatus(applicationData.status || 'Pending');
        
        // Fetch user data
        if (applicationData.userId) {
          const userRef = doc(db, 'users', applicationData.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData({ id: userSnap.id, ...userSnap.data() });
          }
        }
        
        // Fetch job data
        if (applicationData.jobId) {
          const jobRef = doc(db, 'jobs', applicationData.jobId);
          const jobSnap = await getDoc(jobRef);
          if (jobSnap.exists()) {
            setJobData({ id: jobSnap.id, ...jobSnap.data() });
          }
        }
        
        // Fetch company data
        if (applicationData.companyId) {
          const companyRef = doc(db, 'companies', applicationData.companyId);
          const companySnap = await getDoc(companyRef);
          if (companySnap.exists()) {
            setCompanyData({ id: companySnap.id, ...companySnap.data() });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching application details:', error);
        toast.error('Error loading application details');
        navigate('/admin/jobs/viewapplication');
      }
    };
    
    fetchApplicationDetails();
  }, [applicationId, navigate]);
  
  const handleStatusChange = async () => {
    setUpdating(true);
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, {
        status: status
      });
      
      toast.success('Application status updated successfully!');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Error updating application status');
    } finally {
      setUpdating(false);
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
              <h1 className="text-white font-weight-bold">Application Details</h1>
              <div className="custom-breadcrumbs">
                <a href="/admin">Dashboard</a> <span className="mx-2 slash">/</span>
                <a href="/admin/jobs/viewapplication">Applications</a> <span className="mx-2 slash">/</span>
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
                    <strong>Job Title:</strong> {application.jobTitle || 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong>Applied On:</strong> {application.appliedAt ? new Date(application.appliedAt.seconds * 1000).toLocaleString() : 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong> 
                    <select 
                      className="form-control d-inline-block ml-2" 
                      style={{ width: '200px' }}
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                    </select>
                    <button 
                      className="btn btn-primary btn-sm ml-2" 
                      onClick={handleStatusChange}
                      disabled={updating}
                    >
                      {updating ? 'Updating...' : 'Update Status'}
                    </button>
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

              {userData && (
                <div className="mb-5">
                  <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                    <span className="icon-person mr-3"></span>Applicant Information
                  </h3>
                  <div className="p-4 border rounded">
                    <div className="mb-3">
                      <strong>Name:</strong> {userData.name || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong> {userData.email || application.userEmail || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Contact:</strong> {userData.contact || 'N/A'}
                    </div>
                  </div>
                </div>
              )}

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
                      <strong>Type:</strong> {jobData.type || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Salary:</strong> {jobData.salary || 'N/A'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              {companyData && (
                <div className="bg-light p-3 border rounded mb-4">
                  <h3 className="text-primary mt-3 h5 pl-3 mb-3">Company Information</h3>
                  <ul className="list-unstyled pl-3 mb-0">
                    <li className="mb-2">
                      <strong className="text-black">Name:</strong> {companyData.name || 'N/A'}
                    </li>
                    <li className="mb-2">
                      <strong className="text-black">Email:</strong> {companyData.email || application.companyEmail || 'N/A'}
                    </li>
                    <li className="mb-2">
                      <strong className="text-black">Contact:</strong> {companyData.contact || 'N/A'}
                    </li>
                  </ul>
                </div>
              )}


              
              <div className="bg-light p-3 border rounded">
                <h3 className="text-primary mt-3 h5 pl-3 mb-3">Navigation</h3>
                <div className="px-3">
                  <button 
                    className="btn btn-block btn-primary mb-2"
                    onClick={() => navigate('/admin/jobs/viewapplication')}
                  >
                    Back to Applications
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