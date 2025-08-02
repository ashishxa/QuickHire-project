import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../Firebase";
import { Link, useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [apply, setApply] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    // Set loading to true when fetching data
    setLoading(true);
    
    // Jobs - Set up real-time listener
    const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
      setJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      // Set loading to false after data is fetched
      setLoading(false);
    });
    
    // Applications - Set up real-time listener
    const userId = sessionStorage.getItem("userId");
    let unsubApplications;
    if (userId) {
      unsubApplications = onSnapshot(
        query(collection(db, "applications"), where("userId", "==", userId)),
        (snapshot) => {
          setApply(snapshot.docs.map((doc) => doc.data().jobId));
        }
      );
    }
    
    // Clean up listeners when component unmounts
    return () => {
      unsubJobs();
      if (unsubApplications) unsubApplications();
    };
  }, []);

  const handleApply = (jobId) => {
    const isLogin = sessionStorage.getItem("isLogin");
    if (!isLogin) {
      navigate("/login");
    } else {
      navigate(`/ApplyJobs/${jobId}`);
    }
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Poppins', sans-serif;
          }
          
          .jobs-hero-section {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            position: relative;
            overflow: hidden;
            padding: 120px 0 80px;
          }
          
          .jobs-hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
            opacity: 0.6;
          }
          
          .jobs-hero-content {
            position: relative;
            z-index: 2;
          }
          
          .jobs-hero-title {
            font-size: 3.5rem;
            font-weight: 900;
            color: #ffffff;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            margin-bottom: 1rem;
            letter-spacing: -1px;
          }
          
          .jobs-hero-subtitle {
            font-size: 1.3rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            margin-bottom: 2rem;
          }
          
          .breadcrumb-custom {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 25px;
            padding: 1rem 2rem;
            display: inline-block;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .breadcrumb-custom a {
            color: #ffffff;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          .breadcrumb-custom a:hover {
            color: #e0f2fe;
            transform: translateY(-1px);
          }
          
          .breadcrumb-custom .slash {
            color: rgba(255, 255, 255, 0.7);
            margin: 0 0.5rem;
          }
          
          .jobs-section {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
            padding: 80px 0;
            position: relative;
          }
          
          .jobs-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
            opacity: 0.6;
          }
          
          .section-header {
            text-align: center;
            margin-bottom: 4rem;
            position: relative;
            z-index: 2;
          }
          
          .section-title {
            font-size: 3rem;
            font-weight: 800;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            letter-spacing: -1px;
          }
          
          .section-subtitle {
            font-size: 1.2rem;
            color: #64748b;
            font-weight: 500;
            max-width: 600px;
            margin: 0 auto;
          }
          
          .job-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          
          .job-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
            transform: scaleX(0);
            transition: transform 0.3s ease;
          }
          
          .job-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
            border-color: rgba(37, 99, 235, 0.3);
          }
          
          .job-card:hover::before {
            transform: scaleX(1);
          }
          
          .job-logo {
            width: 80px;
            height: 80px;
            border-radius: 16px;
            object-fit: cover;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            border: 3px solid #f1f5f9;
            transition: all 0.3s ease;
          }
          
          .job-card:hover .job-logo {
            transform: scale(1.05);
            border-color: #3b82f6;
          }
          
          .job-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.5rem;
            font-family: 'Poppins', sans-serif;
          }
          
          .job-company {
            font-size: 1.1rem;
            font-weight: 600;
            color: #3b82f6;
            margin-bottom: 1rem;
          }
          
          .job-location {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 1rem;
          }
          
          .job-location i {
            color: #3b82f6;
            font-size: 1.1rem;
          }
          
          .job-type-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 1.5rem;
          }
          
          .job-type-full {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }
          
          .job-type-part {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
          }
          
          .apply-btn {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            border: none;
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          }
          
          .apply-btn:hover {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
            color: white;
          }
          
          .applied-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          }
          
          .pagination-container {
            background: #ffffff;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            margin-top: 3rem;
          }
          
          .pagination-info {
            color: #64748b;
            font-weight: 500;
          }
          
          .pagination-controls {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            align-items: center;
          }
          
          .pagination-btn {
            background: #ffffff;
            border: 2px solid #e2e8f0;
            color: #64748b;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            min-width: 45px;
            text-align: center;
          }
          
          .pagination-btn:hover:not(:disabled) {
            background: #3b82f6;
            border-color: #3b82f6;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          }
          
          .pagination-btn.active {
            background: #3b82f6;
            border-color: #3b82f6;
            color: white;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          }
          
          .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .loading-container {
            background: #ffffff;
            border-radius: 20px;
            padding: 4rem 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            text-align: center;
          }
          
          .no-jobs-container {
            background: #ffffff;
            border-radius: 20px;
            padding: 4rem 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            text-align: center;
          }
          
          .no-jobs-icon {
            font-size: 4rem;
            color: #cbd5e1;
            margin-bottom: 1rem;
          }
          
          .no-jobs-text {
            color: #64748b;
            font-size: 1.2rem;
            font-weight: 500;
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="jobs-hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center jobs-hero-content">
              <h1 className="jobs-hero-title">Find Your Dream Job</h1>
              <p className="jobs-hero-subtitle">
                Discover amazing opportunities from top companies worldwide
              </p>
              <div className="breadcrumb-custom">
                <Link to="/">Home</Link>
                <span className="slash">/</span>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Available Jobs</h2>
            <p className="section-subtitle">
              Browse through our curated list of job opportunities and find the perfect match for your career
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <PacmanLoader
                color="#3b82f6"
                size={40}
                cssOverride={{ display: "block", margin: "0 auto 1rem" }}
                loading={loading}
              />
              <p style={{ color: '#64748b', fontWeight: '500' }}>Loading amazing opportunities...</p>
            </div>
          ) : (
            <>
              <div className="row">
                {currentJobs.map((job) => (
                  <div className="col-lg-6 col-xl-4 mb-4" key={job.id}>
                    <div className="job-card">
                      <div className="d-flex align-items-start mb-3">
                        <img
                          src={job.image || "/assets/images/job_logo_1.jpg"}
                          alt={job.jobTitle}
                          className="job-logo me-3"
                        />
                        <div className="flex-grow-1">
                          <h3 className="job-title">{job.jobTitle}</h3>
                          <div className="job-company">{job.company || "Company"}</div>
                          <div className="job-location">
                            <i className="icon-room"></i>
                            {job.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`job-type-badge ${
                          job.type === "Part Time" ? "job-type-part" : "job-type-full"
                        }`}>
                          {job.type || "Full Time"}
                        </span>
                        
                        {apply.some((el) => el === job.id) ? (
                          <span className="applied-badge">
                            <i className="icon-check mr-2"></i> Applied
                          </span>
                        ) : (
                          <button
                            className="apply-btn"
                            onClick={() => handleApply(job.id)}
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {currentJobs.length === 0 && (
                  <div className="col-12">
                    <div className="no-jobs-container">
                      <div className="no-jobs-icon">
                        <i className="icon-briefcase"></i>
                      </div>
                      <p className="no-jobs-text">No jobs found at the moment. Check back later!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {jobs.length > itemsPerPage && (
                <div className="pagination-container">
                  <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                      <span className="pagination-info">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, jobs.length)} of {jobs.length} Jobs
                      </span>
                    </div>
                    <div className="col-md-6">
                      <div className="pagination-controls">
                        <button
                          className="pagination-btn"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <i className="icon-arrow-left"></i>
                        </button>
                        
                        {[...Array(totalPages)].map((_, idx) => (
                          <button
                            key={idx}
                            className={`pagination-btn ${currentPage === idx + 1 ? "active" : ""}`}
                            onClick={() => handlePageChange(idx + 1)}
                          >
                            {idx + 1}
                          </button>
                        ))}
                        
                        <button
                          className="pagination-btn"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <i className="icon-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
