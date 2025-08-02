import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Firebase';
import { Link } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';

export default function ViewApplication() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      setLoading(false);
      return;
    }

    // Fetch user's applications
    const unsubApplications = onSnapshot(
      query(collection(db, 'applications'), where('userId', '==', userId)),
      (snapshot) => {
        const apps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setApplications(apps);
        setLoading(false);
      }
    );

    // Fetch jobs data for reference
    const unsubJobs = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      const jobsData = {};
      snapshot.docs.forEach((doc) => {
        jobsData[doc.id] = { id: doc.id, ...doc.data() };
      });
      setJobs(jobsData);
    });

    return () => {
      unsubApplications();
      unsubJobs();
    };
  }, []);

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

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = applications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              <h1 className="text-white font-weight-bold">My Applications</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>My Applications</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="mb-0">Application History</h3>
                </div>
                <div className="card-body">
                  {applications.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <i className="icon-paper-plane" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                      </div>
                      <h4 className="text-muted">No Applications Yet</h4>
                      <p className="text-muted">You haven't applied to any jobs yet.</p>
                      <Link to="/jobs" className="btn btn-primary">
                        Browse Jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="thead-dark">
                          <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentApplications.map((app) => (
                            <tr key={app.id}>
                              <td>
                                <strong>{app.jobTitle || jobs[app.jobId]?.jobTitle || 'N/A'}</strong>
                              </td>
                              <td>{jobs[app.jobId]?.company || 'N/A'}</td>
                              <td>
                                {app.appliedAt ? 
                                  new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 
                                  'N/A'
                                }
                              </td>
                              <td>
                                <span className={getStatusBadge(app.status)}>
                                  {app.status || 'Pending'}
                                </span>
                              </td>
                              <td>
                                <Link 
                                  to={`/applications/${app.id}`} 
                                  className="btn btn-sm btn-outline-info"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {/* Pagination - Only show if more than 5 items */}
                  {applications.length > itemsPerPage && (
                    <div className="d-flex justify-content-center mt-4">
                      <nav>
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(totalPages)].map((_, idx) => (
                            <li
                              key={idx}
                              className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
                            >
                              <button 
                                className="page-link"
                                onClick={() => handlePageChange(idx + 1)}
                              >
                                {idx + 1}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}