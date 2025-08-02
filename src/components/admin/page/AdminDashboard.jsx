import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

export default function AdminDashboard() {
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all jobs
    const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTotalJobs(jobs.length);
      setRecentJobs(jobs.slice(0, 5)); // Show last 5 jobs
    });

    // Fetch all users
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTotalUsers(users.length);
      setRecentUsers(users.slice(0, 5)); // Show last 5 users
    });

    // Fetch companies (users with userType 2)
    const unsubCompanies = onSnapshot(
      query(collection(db, "users"), where("userType", "==", 2)),
      (snapshot) => {
        setTotalCompanies(snapshot.size);
      }
    );

    // Fetch all applications
    const unsubApplications = onSnapshot(collection(db, "applications"), (snapshot) => {
      setTotalApplications(snapshot.size);
    });

    setLoading(false);

    return () => {
      unsubJobs();
      unsubUsers();
      unsubCompanies();
      unsubApplications();
    };
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .admin-dashboard {
            font-family: 'Inter', sans-serif;
          }
          
          .admin-dashboard h1, .admin-dashboard h2, .admin-dashboard h3, .admin-dashboard h4 {
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
          
          .stats-section {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 60px 0;
            position: relative;
            overflow: hidden;
          }
          
          .stats-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
          }
          
          .stats-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            transition: all 0.4s ease;
            margin-bottom: 2rem;
            position: relative;
            overflow: hidden;
          }
          
          .stats-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
            transition: left 0.6s ease;
          }
          
          .stats-card:hover::before {
            left: 100%;
          }
          
          .stats-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
          }
          
          .stats-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.5rem;
            color: white;
            transition: all 0.4s ease;
          }
          
          .stats-card:hover .stats-icon {
            transform: scale(1.1) rotate(5deg);
          }
          
          .stats-number {
            font-size: 2.5rem;
            font-weight: 900;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
          }
          
          .stats-label {
            font-size: 1rem;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .content-section {
            background: white;
            padding: 60px 0;
          }
          
          .content-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            margin-bottom: 2rem;
            transition: all 0.4s ease;
          }
          
          .content-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
          }
          
          .content-card h3 {
            color: #1e293b;
            font-weight: 700;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .content-card h3::before {
            content: '';
            width: 4px;
            height: 20px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            border-radius: 2px;
          }
          
          .table {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          }
          
          .table thead th {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            border: none;
            padding: 1rem;
            font-weight: 600;
          }
          
          .table tbody td {
            padding: 1rem;
            border-bottom: 1px solid rgba(37, 99, 235, 0.1);
            vertical-align: middle;
          }
          
          .table tbody tr:hover {
            background: rgba(59, 130, 246, 0.05);
          }
          
          .btn-primary-custom {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            border: none;
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.4s ease;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          }
          
          .btn-primary-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
            color: white;
            text-decoration: none;
          }
          
          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
          }
          
          .status-active {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.2);
          }
          
          .status-pending {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.2);
          }
          
          .user-type-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
          }
          
          .user-type-admin {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
          }
          
          .user-type-company {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            border: 1px solid rgba(59, 130, 246, 0.2);
          }
          
          .user-type-user {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.2);
          }
          
          @media (max-width: 768px) {
            .dashboard-hero h1 {
              font-size: 2rem;
            }
            
            .stats-number {
              font-size: 2rem;
            }
            
            .content-card {
              padding: 1.5rem;
            }
          }
        `}
      </style>
      
      <div className="admin-dashboard">
        {/* Hero Section */}
        <section className="dashboard-hero">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1>Admin Dashboard</h1>
                <div className="breadcrumb">
                  <Link to="/admin">Home</Link>
                  <span className="mx-2">/</span>
                  <span style={{ color: 'white' }}>
                    <strong>Dashboard</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="container my-5 text-center">
            <div style={{ padding: '60px 0' }}>
              <PacmanLoader
                color="#3b82f6"
                size={30}
                cssOverride={{ display: "block", margin: "0 auto" }}
                loading={loading}
              />
              <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '1.1rem' }}>
                Loading dashboard data...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <section className="stats-section">
              <div className="container">
                <div className="row text-center mb-5">
                  <div className="col-12">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>
                      Platform Overview
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>
                      Real-time statistics of the QuickHire platform
                    </p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <div className="stats-card">
                      <div className="stats-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}>
                        <i className="icon-briefcase"></i>
                      </div>
                      <div className="stats-number">{totalJobs}</div>
                      <div className="stats-label">Total Jobs</div>
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6">
                    <div className="stats-card">
                      <div className="stats-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <i className="icon-users"></i>
                      </div>
                      <div className="stats-number">{totalUsers}</div>
                      <div className="stats-label">Total Users</div>
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6">
                    <div className="stats-card">
                      <div className="stats-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <i className="icon-building"></i>
                      </div>
                      <div className="stats-number">{totalCompanies}</div>
                      <div className="stats-label">Companies</div>
                    </div>
                  </div>
                  
                  <div className="col-lg-3 col-md-6">
                    <div className="stats-card">
                      <div className="stats-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                        <i className="icon-file-text"></i>
                      </div>
                      <div className="stats-number">{totalApplications}</div>
                      <div className="stats-label">Applications</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="content-section">
              <div className="container">
                <div className="row">
                  {/* Recent Jobs */}
                  <div className="col-lg-6">
                    <div className="content-card">
                      <h3>Recent Jobs</h3>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Company</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentJobs.map((job) => (
                              <tr key={job.id}>
                                <td>
                                  <strong>{job.title}</strong>
                                  <br />
                                  <small style={{ color: '#6b7280' }}>{job.location}</small>
                                </td>
                                <td>{job.companyName}</td>
                                <td>
                                  <span className="status-badge status-active">Active</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-center mt-3">
                        <Link to="/admin/jobs/recentjob" className="btn-primary-custom">
                          View All Jobs
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div className="col-lg-6">
                    <div className="content-card">
                      <h3>Recent Users</h3>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentUsers.map((user) => (
                              <tr key={user.id}>
                                <td>
                                  <strong>{user.name}</strong>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                  {user.userType === 1 && (
                                    <span className="user-type-badge user-type-admin">Admin</span>
                                  )}
                                  {user.userType === 2 && (
                                    <span className="user-type-badge user-type-company">Company</span>
                                  )}
                                  {user.userType === 3 && (
                                    <span className="user-type-badge user-type-user">User</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-center mt-3">
                        <Link to="/admin/jobs/manageuse" className="btn-primary-custom">
                          Manage Users
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="content-card">
                      <h3>Quick Actions</h3>
                      <div className="row">
                        <div className="col-md-3 col-sm-6 mb-3">
                          <Link to="/admin/jobs/managecompany" className="btn-primary-custom w-100">
                            Manage Companies
                          </Link>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-3">
                          <Link to="/admin/jobs/viewapplication" className="btn-primary-custom w-100">
                            View Applications
                          </Link>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-3">
                          <Link to="/admin/jobs/managejob" className="btn-primary-custom w-100">
                            Manage Jobs
                          </Link>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-3">
                          <Link to="/admin/jobs/recentjob" className="btn-primary-custom w-100">
                            Recent Jobs
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}