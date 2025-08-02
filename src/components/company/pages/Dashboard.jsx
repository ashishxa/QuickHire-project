import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = sessionStorage.getItem("email");
    const userId = sessionStorage.getItem("userId");

    if (!userEmail || !userId) {
      setLoading(false);
      return;
    }

    // Fetch company's jobs
    const unsubJobs = onSnapshot(
      query(collection(db, "jobs"), where("email", "==", userEmail)),
      (snapshot) => {
        const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTotalJobs(jobs.length);
        setRecentJobs(jobs.slice(0, 5)); // Show last 5 jobs
      }
    );

    // Fetch applications for company's jobs
    const unsubApplications = onSnapshot(
      query(collection(db, "applications"), where("companyId", "==", userId)),
      (snapshot) => {
        const applications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTotalApplications(applications.length);
        setPendingApplications(applications.filter(app => app.status === "Pending").length);
      }
    );

    setLoading(false);

    return () => {
      unsubJobs();
      unsubApplications();
    };
  }, []);

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
          
          .stats-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(59, 130, 246, 0.1);
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
            display: block;
            height: 100%;
          }
          
          .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(59, 130, 246, 0.15);
            text-decoration: none;
            color: inherit;
          }
          
          .stats-card .icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 1.5rem;
            color: white;
            transition: all 0.3s ease;
          }
          
          .stats-card:hover .icon {
            transform: scale(1.1);
          }
          
          .stats-card .icon.briefcase { background: linear-gradient(135deg, #3b82f6, #1e40af); }
          .stats-card .icon.paper-plane { background: linear-gradient(135deg, #10b981, #059669); }
          .stats-card .icon.clock { background: linear-gradient(135deg, #f59e0b, #d97706); }
          .stats-card .icon.plus { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
          
          .stats-card h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
          }
          
          .stats-card .number {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0;
          }
          
          .stats-card .text-primary { color: #3b82f6 !important; }
          .stats-card .text-success { color: #10b981 !important; }
          .stats-card .text-warning { color: #f59e0b !important; }
          .stats-card .text-info { color: #8b5cf6 !important; }
          
          .content-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(59, 130, 246, 0.1);
            overflow: hidden;
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
          
          .table {
            border-radius: 10px;
            overflow: hidden;
          }
          
          .table thead th {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: none;
            color: #374151;
            font-weight: 600;
            padding: 1rem;
          }
          
          .table tbody td {
            padding: 1rem;
            border: none;
            border-bottom: 1px solid rgba(59, 130, 246, 0.1);
            vertical-align: middle;
          }
          
          .table tbody tr:hover {
            background: rgba(59, 130, 246, 0.05);
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
          
          .btn-info-modern {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
          }
          
          .btn-warning-modern {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
          }
          
          .btn-success-modern {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
          }
        `}
      </style>
      
      <div className="site-wrap company-dashboard">
        <section className="dashboard-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1>Company Dashboard</h1>
                <div className="breadcrumb">
                  <a href="/company">Dashboard</a> 
                  <span className="mx-2">/</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>Overview</span>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '15px', 
                  padding: '1rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <small style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Welcome back!</small>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    {sessionStorage.getItem("name") || "Company"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section services-section bg-light" style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="row">
              <div className="col-6 col-md-6 col-lg-3 mb-4 mb-lg-5">
                <Link to="/company/jobs/managejobs" className="stats-card">
                  <div className="icon briefcase">
                    <i className="icon-briefcase"></i>
                  </div>
                  <h3>Total Jobs</h3>
                  <div className="number text-primary">{totalJobs}</div>
                </Link>
              </div>
              <div className="col-6 col-md-6 col-lg-3 mb-4 mb-lg-5">
                <Link to="/company/jobs/managejobs" className="stats-card">
                  <div className="icon paper-plane">
                    <i className="icon-paper-plane"></i>
                  </div>
                  <h3>Total Applications</h3>
                  <div className="number text-success">{totalApplications}</div>
                </Link>
              </div>
              <div className="col-6 col-md-6 col-lg-3 mb-4 mb-lg-5">
                <Link to="/company/jobs/managejobs" className="stats-card">
                  <div className="icon clock">
                    <i className="icon-clock"></i>
                  </div>
                  <h3>Pending Applications</h3>
                  <div className="number text-warning">{pendingApplications}</div>
                </Link>
              </div>
              <div className="col-6 col-md-6 col-lg-3 mb-4 mb-lg-5">
                <Link to="/company/jobs/add" className="stats-card">
                  <div className="icon plus">
                    <i className="icon-plus"></i>
                  </div>
                  <h3>Add New Job</h3>
                  <div className="number text-info">+</div>
                </Link>
              </div>
            </div>

            {/* Recent Jobs Section */}
            <div className="row mt-5">
              <div className="col-12">
                <div className="content-card">
                  <div className="card-header">
                    <h4>Recent Job Posts</h4>
                  </div>
                  <div className="card-body">
                    {recentJobs.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <div style={{ 
                          fontSize: '3rem', 
                          color: '#9ca3af', 
                          marginBottom: '1rem' 
                        }}>
                          <i className="icon-briefcase"></i>
                        </div>
                        <h5 style={{ color: '#6b7280', marginBottom: '1rem' }}>No jobs posted yet</h5>
                        <Link to="/company/jobs/add" className="btn-modern btn-primary-modern">
                          <i className="icon-plus"></i>
                          Add Your First Job
                        </Link>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Job Title</th>
                              <th>Location</th>
                              <th>Salary</th>
                              <th>Posted On</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentJobs.map((job) => (
                              <tr key={job.id}>
                                <td style={{ fontWeight: '600', color: '#1e293b' }}>{job.jobTitle}</td>
                                <td>
                                  <span style={{ 
                                    background: 'rgba(59, 130, 246, 0.1)', 
                                    color: '#3b82f6', 
                                    padding: '0.25rem 0.75rem', 
                                    borderRadius: '15px', 
                                    fontSize: '0.875rem' 
                                  }}>
                                    <i className="icon-room" style={{ marginRight: '0.25rem' }}></i>
                                    {job.location}
                                  </span>
                                </td>
                                <td style={{ fontWeight: '600', color: '#059669' }}>{job.salary}</td>
                                <td style={{ color: '#6b7280' }}>
                                  {job.createdAt ? 
                                    new Date(job.createdAt.seconds * 1000).toLocaleDateString() : 
                                    'N/A'
                                  }
                                </td>
                                <td>
                                  <Link 
                                    to={`/company/viewapp/${job.id}`} 
                                    className="btn-modern btn-info-modern"
                                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                  >
                                    <i className="icon-eye"></i>
                                    View Applications
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
                <div className="content-card">
                  <div className="card-header">
                    <h4>Quick Actions</h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <Link to="/company/jobs/add" className="btn-modern btn-primary-modern" style={{ width: '100%', justifyContent: 'center' }}>
                          <i className="icon-plus"></i>
                          Add New Job
                        </Link>
                      </div>
                      <div className="col-md-3 mb-3">
                        <Link to="/company/jobs/managejobs" className="btn-modern btn-info-modern" style={{ width: '100%', justifyContent: 'center' }}>
                          <i className="icon-briefcase"></i>
                          Manage Jobs
                        </Link>
                      </div>
                      <div className="col-md-3 mb-3">
                        <Link to="/company/jobs/managejobs" className="btn-modern btn-warning-modern" style={{ width: '100%', justifyContent: 'center' }}>
                          <i className="icon-paper-plane"></i>
                          View Applications
                        </Link>
                      </div>
                      <div className="col-md-3 mb-3">
                        <Link to="/company" className="btn-modern btn-success-modern" style={{ width: '100%', justifyContent: 'center' }}>
                          <i className="icon-dashboard"></i>
                          Dashboard
                        </Link>
                      </div>
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