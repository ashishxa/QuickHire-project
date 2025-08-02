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
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  
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
        setStatus(applicationData.status || 'Pending');
        
        // Fetch user data
        if (applicationData.userId) {
          try {
            const userRef = doc(db, 'users', applicationData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setUserData({ id: userSnap.id, ...userSnap.data() });
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
        
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
  
  const handleStatusChange = async () => {
    if (!applicationId) {
      toast.error('Application ID is required');
      return;
    }

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

  const handleResumeClick = (resumeUrl) => {
    if (!resumeUrl) {
      toast.error('No resume available');
      return;
    }
    
    // Try to open in new tab first
    try {
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening resume:', error);
      // Fallback to direct download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'resume.pdf';
      link.click();
    }
  };

  const openResumeInModal = (resumeUrl) => {
    if (!resumeUrl) {
      toast.error('No resume available');
      return;
    }

    // Create modal for PDF viewing
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 10px;
      width: 90%;
      height: 90%;
      position: relative;
      overflow: hidden;
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      font-size: 20px;
      cursor: pointer;
      z-index: 10000;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = resumeUrl;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `;

    modalContent.appendChild(closeButton);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const closeModal = () => {
      document.body.removeChild(modal);
    };

    closeButton.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  };

  const openResumeInPDFViewer = (resumeUrl) => {
    if (!resumeUrl) {
      toast.error('No resume available');
      return;
    }

    // Use PDF.js or similar for better PDF viewing
    const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(resumeUrl)}`;
    window.open(viewerUrl, '_blank', 'noopener,noreferrer');
  };

  const openResumeDirect = (resumeUrl) => {
    if (!resumeUrl) {
      toast.error('No resume available');
      return;
    }

    // Direct download
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `resume_${userData?.name || 'applicant'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScheduleInterview = () => {
    if (!meetingLink.trim()) {
      toast.error('Please enter a meeting link');
      return;
    }

    if (!userData?.contact) {
      toast.error('Applicant contact information not available');
      return;
    }

    // Format phone number for WhatsApp
    let phone = userData.contact.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '91' + phone.substring(1);
    } else if (!phone.startsWith('91')) {
      phone = '91' + phone;
    }
    const formattedPhone = phone;

    // Create timing information
    let timingInfo = '';
    if (interviewDate && interviewTime) {
      timingInfo = `\n📅 Date: ${interviewDate}\n⏰ Time: ${interviewTime}`;
    } else if (interviewDate) {
      timingInfo = `\n📅 Date: ${interviewDate}`;
    } else if (interviewTime) {
      timingInfo = `\n⏰ Time: ${interviewTime}`;
    }
    
    // Create WhatsApp message
    const message = encodeURIComponent(`Hello ${userData?.name || 'there'}! 

You have been shortlisted for the position of ${jobData?.jobTitle || 'the job'}.

Please join the interview meeting via this link: ${meetingLink}${timingInfo}

Best regards,
${sessionStorage.getItem('name') || 'Company Team'}`);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    
    // Open WhatsApp
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      toast.success('WhatsApp opened with pre-filled message!');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast.error('Error opening WhatsApp. Please try manually.');
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <PacmanLoader
          color="#3b82f6"
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
                onClick={() => navigate('/company/jobs/managejobs')}
              >
                Back to Manage Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .company-dashboard {
            font-family: 'Inter', sans-serif;
          }
          
          .company-dashboard h1, .company-dashboard h2, .company-dashboard h3, .company-dashboard h4 {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
          }
          
          .dashboard-hero {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            padding: 80px 0 60px;
            position: relative;
            overflow: hidden;
          }
          
          .dashboard-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.3;
          }
          
          .dashboard-hero h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 1rem;
          }
          
          .dashboard-hero .breadcrumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 25px;
            padding: 0.5rem 1.5rem;
            display: inline-block;
            backdrop-filter: blur(10px);
          }
          
          .dashboard-hero .breadcrumb a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: color 0.3s ease;
          }
          
          .dashboard-hero .breadcrumb a:hover {
            color: white;
          }
          
          .content-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(59, 130, 246, 0.1);
            overflow: hidden;
            margin-bottom: 2rem;
          }
          
          .content-card .card-header {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-bottom: 1px solid rgba(59, 130, 246, 0.1);
            padding: 1.5rem;
          }
          
          .content-card .card-header h4 {
            color: #1e293b;
            font-weight: 600;
            margin: 0;
          }
          
          .content-card .card-body {
            padding: 1.5rem;
          }
          
          .btn-modern {
            border-radius: 10px;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            transition: all 0.3s ease;
            border: none;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .btn-modern:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            text-decoration: none;
          }
          
          .btn-primary-modern {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
          }
          
          .btn-success-modern {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
          }
          
          .btn-warning-modern {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
          }
          
          .btn-danger-modern {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
          }
          
          .btn-secondary-modern {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            color: white;
          }
          
          .btn-info-modern {
            background: linear-gradient(135deg, #06b6d4, #0891b2);
            color: white;
          }
          
          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: capitalize;
          }
          
          .status-pending {
            background: rgba(245, 158, 11, 0.1);
            color: #d97706;
          }
          
          .status-accepted {
            background: rgba(16, 185, 129, 0.1);
            color: #059669;
          }
          
          .status-rejected {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
          }
          
          .status-interview {
            background: rgba(139, 92, 246, 0.1);
            color: #7c3aed;
          }
          
          .form-control {
            border-radius: 10px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            padding: 0.75rem 1rem;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            background: #f8fafc;
          }
          
          .form-control:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
            background: white;
          }
          
          .form-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
          }
          
          .info-item {
            padding: 1rem;
            border-bottom: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          .info-item:last-child {
            border-bottom: none;
          }
          
          .info-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.25rem;
          }
          
          .info-value {
            color: #6b7280;
          }
          
          .resume-section {
            background: rgba(59, 130, 246, 0.05);
            border-radius: 10px;
            padding: 1.5rem;
            border: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          .interview-section {
            background: rgba(16, 185, 129, 0.05);
            border-radius: 10px;
            padding: 1.5rem;
            border: 1px solid rgba(16, 185, 129, 0.1);
          }
        `}
      </style>
      
      <div className="site-wrap company-dashboard">
        <section className="dashboard-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1>Application Details</h1>
                <div className="breadcrumb">
                  <a href="/company">Dashboard</a> 
                  <span className="mx-2">/</span>
                  <a href="/company/jobs/managejobs">Manage Jobs</a>
                  <span className="mx-2">/</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>Application Details</span>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '15px', 
                  padding: '1rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <small style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Review application</small>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    {sessionStorage.getItem("name") || "Company"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section bg-light" style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                {/* Application Information */}
                <div className="content-card">
                  <div className="card-header">
                    <h4>Application Information</h4>
                  </div>
                  <div className="card-body">
                    <div className="info-item">
                      <div className="info-label">Job Title</div>
                      <div className="info-value">{application.jobTitle || jobData?.jobTitle || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Applied Date</div>
                      <div className="info-value">
                        {application.appliedAt ? 
                          new Date(application.appliedAt.seconds * 1000).toLocaleDateString() : 
                          'N/A'
                        }
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Current Status</div>
                      <div className="info-value">
                        <span className={`status-badge status-${application.status?.toLowerCase() || 'pending'}`}>
                          {application.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applicant Information */}
                <div className="content-card">
                  <div className="card-header">
                    <h4>Applicant Information</h4>
                  </div>
                  <div className="card-body">
                    <div className="info-item">
                      <div className="info-label">Full Name</div>
                      <div className="info-value">{userData?.name || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Email</div>
                      <div className="info-value">{userData?.email || application.email || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Contact Number</div>
                      <div className="info-value">{userData?.contact || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Address</div>
                      <div className="info-value">{userData?.address || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Skills</div>
                      <div className="info-value">{userData?.skills || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Experience</div>
                      <div className="info-value">{userData?.experience || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Education</div>
                      <div className="info-value">{userData?.education || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Resume Section */}
                {application.resume && (
                  <div className="content-card">
                    <div className="card-header">
                      <h4>Resume</h4>
                    </div>
                    <div className="card-body">
                      <div className="resume-section">
                        <p style={{ marginBottom: '1rem', color: '#374151' }}>
                          <strong>Resume File:</strong> {application.resume.split('/').pop()}
                        </p>
                        <div className="d-flex gap-2 flex-wrap">
                          <button 
                            onClick={() => handleResumeClick(application.resume)}
                            className="btn-modern btn-primary-modern"
                          >
                            <i className="icon-eye"></i>
                            View Resume
                          </button>
                          <button 
                            onClick={() => openResumeInModal(application.resume)}
                            className="btn-modern btn-info-modern"
                          >
                            <i className="icon-window-maximize"></i>
                            Open in Modal
                          </button>
                          <button 
                            onClick={() => openResumeDirect(application.resume)}
                            className="btn-modern btn-success-modern"
                          >
                            <i className="icon-download"></i>
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-lg-4">
                {/* Status Management */}
                <div className="content-card">
                  <div className="card-header">
                    <h4>Update Status</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Application Status</label>
                      <select 
                        className="form-control"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <button 
                      onClick={handleStatusChange}
                      className="btn-modern btn-primary-modern w-100"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <div className="spinner-border spinner-border-sm" role="status" style={{ marginRight: '0.5rem' }}>
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="icon-check"></i>
                          Update Status
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Interview Scheduling */}
                <div className="content-card">
                  <div className="card-header">
                    <h4>Schedule Interview</h4>
                  </div>
                  <div className="card-body">
                    <div className="interview-section">
                      <div className="mb-3">
                        <label className="form-label">Meeting Link</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Interview Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Interview Time</label>
                        <input
                          type="time"
                          className="form-control"
                          value={interviewTime}
                          onChange={(e) => setInterviewTime(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={handleScheduleInterview}
                        className="btn-modern btn-success-modern w-100"
                        disabled={!meetingLink.trim()}
                      >
                        <i className="icon-whatsapp"></i>
                        Send WhatsApp Invite
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="content-card">
                  <div className="card-header">
                    <h4>Quick Actions</h4>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button 
                        onClick={() => setStatus('Accepted')}
                        className="btn-modern btn-success-modern"
                      >
                        <i className="icon-check-circle"></i>
                        Accept Application
                      </button>
                      <button 
                        onClick={() => setStatus('Rejected')}
                        className="btn-modern btn-danger-modern"
                      >
                        <i className="icon-x-circle"></i>
                        Reject Application
                      </button>
                      <button 
                        onClick={() => setStatus('Shortlisted')}
                        className="btn-modern btn-warning-modern"
                      >
                        <i className="icon-star"></i>
                        Shortlist
                      </button>
                      <button 
                        onClick={() => navigate('/company/jobs/managejobs')}
                        className="btn-modern btn-secondary-modern"
                      >
                        <i className="icon-arrow-left"></i>
                        Back to Jobs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}