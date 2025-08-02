import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../Firebase';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [totalApplications, setTotalApplications] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [shortlistedApplications, setShortlistedApplications] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const userEmail = sessionStorage.getItem('email');
    const userName = sessionStorage.getItem('name');

    if (!userId) {
      setLoading(false);
      return;
    }

    // Set user data
    setUserData({
      id: userId,
      email: userEmail,
      name: userName
    });

    // Fetch user's applications
    const unsubApplications = onSnapshot(
      query(collection(db, 'applications'), where('userId', '==', userId)),
      (snapshot) => {
        const applications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTotalApplications(applications.length);
        setPendingApplications(applications.filter(app => app.status === 'Pending').length);
        setShortlistedApplications(applications.filter(app => app.status === 'Shortlisted').length);
        setRecentApplications(applications.slice(0, 5)); // Show last 5 applications
        setLoading(false);
      }
    );

    return () => {
      unsubApplications();
    };
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
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
              <h1 className="text-white font-weight-bold">User Dashboard</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Dashboard</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section services-section bg-light block__62849" id="next-section">
        <div className="container">
          {/* User Profile Section */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="icon-user text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                  </div>
                  <h3 className="card-title">{userData?.name || 'User'}</h3>
                  <p className="text-muted">{userData?.email}</p>
                  <Link to="/profile" className="btn btn-outline-primary btn-sm">
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row">
            <div className="col-6 col-md-6 col-lg-3 mb-4 mb-lg-5">
              <Link to="/applications" className="block__16443 text-center d-block">
                <span className="custom-icon mx-auto">
                  <span className="icon-paper-plane d-block" />
                </span>
                <h3>Total Applications</h3>
                <p className="h2 text-primary">{totalApplications}</p>
              </Link>
            </div>
            <div className="col-6 col-md-6 col-lg-3 mb-4 mb-lg-5">
              <Link to="/applications" className="block__16443 text-center d-block">
                <span className="custom-icon mx-auto">
                  <span className="icon-clock d-block" />
                </span>
                <h3>Pending</h3>
                <p className="h2 text-warning">{pendingApplications}</p>
              </Link>
            </div>
            <div className="col-6 col-md-6 col-lg-3 mb-4 mb-lg-5">
              <Link to="/applications" className="block__16443 text-center d-block">
                <span className="custom-icon mx-auto">
                  <span className="icon-star d-block" />
                </span>
                <h3>Shortlisted</h3>
                <p className="h2 text-success">{shortlistedApplications}</p>
              </Link>
            </div>
            <div className="col-6 col-md-6 col-lg-3 mb-4 mb-lg-5">
              <Link to="/jobs" className="block__16443 text-center d-block">
                <span className="custom-icon mx-auto">
                  <span className="icon-search d-block" />
                </span>
                <h3>Browse Jobs</h3>
                <p className="text-info">Find new opportunities</p>
              </Link>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="mb-0">Recent Applications</h4>
                </div>
                <div className="card-body">
                  {recentApplications.length === 0 ? (
                    <div className="text-center text-muted">
                      <p>No applications yet. <Link to="/jobs">Start applying for jobs</Link></p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Job Title</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentApplications.map((app) => (
                            <tr key={app.id}>
                              <td>
                                <strong>{app.jobTitle || 'N/A'}</strong>
                              </td>
                              <td>
                                {app.appliedAt ? 
                                  new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 
                                  'N/A'
                                }
                              </td>
                              <td>
                                <span className={`badge ${
                                  app.status === 'Hired' ? 'badge-success' :
                                  app.status === 'Rejected' ? 'badge-danger' :
                                  app.status === 'Shortlisted' ? 'badge-warning' :
                                  app.status === 'Under Review' ? 'badge-info' :
                                  'badge-secondary'
                                }`}>
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
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="mb-0">Quick Actions</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <Link to="/jobs" className="btn btn-primary btn-block">
                        <i className="icon-search mr-2"></i>
                        Browse Jobs
                      </Link>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Link to="/applications" className="btn btn-info btn-block">
                        <i className="icon-paper-plane mr-2"></i>
                        My Applications
                      </Link>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Link to="/profile" className="btn btn-warning btn-block">
                        <i className="icon-user mr-2"></i>
                        Edit Profile
                      </Link>
                    </div>
                    <div className="col-md-3 mb-3">
                      <Link to="/" className="btn btn-success btn-block">
                        <i className="icon-home mr-2"></i>
                        Home
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 