import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { PacmanLoader } from "react-spinners";
import { Link, useParams } from "react-router-dom";

export default function ViewApp() {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState({});
  const [companies, setCompanies] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Fetch users
    onSnapshot(collection(db, "users"), (snapshot) => {
      const data = {};
      snapshot.docs.forEach((doc) => {
        data[doc.id] = doc.data().name;
      });
      setUsers(data);
    });

    // Fetch companies
    onSnapshot(collection(db, "companies"), (snapshot) => {
      const data = {};
      snapshot.docs.forEach((doc) => {
        data[doc.id] = doc.data().name;
      });
      setCompanies(data);
    });

    // Fetch applications for this specific job
    const unsubscribe = onSnapshot(
      query(collection(db, "applications"), where("jobId", "==", id)), 
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setApplications(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching applications:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

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
          
          .btn-secondary-modern {
            background: linear-gradient(135deg, #6b7280, #4b5563);
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
        `}
      </style>
      
      <div className="site-wrap company-dashboard">
        <section className="dashboard-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1>View Applications</h1>
                <div className="breadcrumb">
                  <a href="/company">Dashboard</a> 
                  <span className="mx-2">/</span>
                  <a href="/company/jobs/managejobs">Manage Jobs</a>
                  <span className="mx-2">/</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>Applications</span>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '15px', 
                  padding: '1rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <small style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Review job applications</small>
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
            <div className="content-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4>All Applications</h4>
                <Link to="/company/jobs/managejobs" className="btn-modern btn-secondary-modern">
                  <i className="icon-arrow-left"></i>
                  Back to Jobs
                </Link>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <PacmanLoader
                      color="#3b82f6"
                      size={30}
                      cssOverride={{ display: "block", margin: "0 auto" }}
                      loading={loading}
                    />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{ 
                      fontSize: '3rem', 
                      color: '#9ca3af', 
                      marginBottom: '1rem' 
                    }}>
                      <i className="icon-paper-plane"></i>
                    </div>
                    <h5 style={{ color: '#6b7280', marginBottom: '1rem' }}>No applications found</h5>
                    <p style={{ color: '#9ca3af' }}>Applications for this job will appear here.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Applicant Name</th>
                          <th>Email</th>
                          <th>Applied Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((application, index) => (
                          <tr key={application.id}>
                            <td style={{ fontWeight: '600', color: '#374151' }}>{index + 1}</td>
                            <td style={{ fontWeight: '600', color: '#1e293b' }}>
                              {users[application.userId] || 'Unknown User'}
                            </td>
                            <td style={{ color: '#6b7280' }}>{application.email}</td>
                            <td style={{ color: '#6b7280' }}>
                              {application.appliedAt ? 
                                new Date(application.appliedAt.seconds * 1000).toLocaleDateString() : 
                                'N/A'
                              }
                            </td>
                            <td>
                              <span className={`status-badge status-${application.status?.toLowerCase() || 'pending'}`}>
                                {application.status || 'Pending'}
                              </span>
                            </td>
                            <td>
                              <Link 
                                to={`/company/application/${application.id}`} 
                                className="btn-modern btn-info-modern"
                                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                              >
                                <i className="icon-eye"></i>
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
        </section>
      </div>
    </>
  );
}
