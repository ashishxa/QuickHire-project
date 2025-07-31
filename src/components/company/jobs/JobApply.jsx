import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { toast } from 'react-toastify';
import { PacmanLoader } from 'react-spinners';

export default function JobApply() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [application, setApplication] = useState(null);
  const [userData, setUserData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [status, setStatus] = useState('');
  

 
  
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
                <a href="/company">Dashboard</a> <span className="mx-2 slash">/</span>
                <a href="/company/viewapp">Applications</a> <span className="mx-2 slash">/</span>
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
                    <strong>Job Title:</strong>
                  </div>
                  <div className="mb-3">
                    <strong>Applied On:</strong> 
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
                
                 
                    >
                      {updating ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                 
                  <div className="mb-3">
                      <strong>Resume:</strong> 
                      <input />
                    </div>
                 
                   <div className="mb-3">
                      <strong>Cover Letter:</strong> <br />
                     <input />
                    </div>
                </div>
              </div>

             
               <div className="mb-5">
                  <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                    <span className="icon-person mr-3"></span>Applicant Information
                  </h3>
                  <div className="p-4 border rounded">
                    <div className="mb-3">
                      <strong>Name:</strong> 
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong> 
                    </div>
                    <div className="mb-3">
                      <strong>Contact:</strong> 
                    </div>
                  </div>
                </div>

            
           <div className="mb-5">
                  <h3 className="h5 d-flex align-items-center mb-4 text-primary">
                    <span className="icon-briefcase mr-3"></span>Job Information
                  </h3>
                  <div className="p-4 border rounded">
                    <div className="mb-3">
                      <strong>Title:</strong> 
                    </div>
                    <div className="mb-3">
                      <strong>Location:</strong> 
                    </div>
                    <div className="mb-3">
                      <strong>Type:</strong>
                    </div>
                    <div className="mb-3">
                      <strong>Salary:</strong> 
                    </div>
                  </div>
                </div>
            </div>

            <div className="col-lg-4">

              
              <div className="bg-light p-3 border rounded">
                <h3 className="text-primary mt-3 h5 pl-3 mb-3">Navigation</h3>
                <div className="px-3">
                  <button 
                    className="btn btn-block btn-primary mb-2"
                    onClick={() => navigate('/company/viewapp')}
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