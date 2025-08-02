import { deleteDoc, doc, collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function ManageJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [load, setLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const fetchData = () => {
    const userEmail = sessionStorage.getItem("email");
    const q = query(collection(db, "jobs"));
    onSnapshot(q, (jobData) => {
      setAllJobs(
        jobData.docs
          .map((el) => {
            return { id: el.id, ...el.data() };
          })
          .filter((job) => job.email === userEmail)
      );
      setLoad(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const DeleteJobs = (jobId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "jobs", jobId))
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your job has been deleted.",
              icon: "success",
            });
          })
          .catch((error) => {
            toast.error("Delete failed: " + error.message);
          });
      }
    });
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = allJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(allJobs.length / jobsPerPage);

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
          
          .btn-warning-modern {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
          }
          
          .btn-danger-modern {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
          }
          
          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: capitalize;
          }
          
          .status-active {
            background: rgba(16, 185, 129, 0.1);
            color: #059669;
          }
          
          .status-inactive {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
          }
          
          .pagination {
            justify-content: center;
            margin-top: 2rem;
          }
          
          .page-link {
            border-radius: 8px;
            margin: 0 0.25rem;
            border: 1px solid rgba(59, 130, 246, 0.2);
            color: #3b82f6;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .page-link:hover {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }
          
          .page-item.active .page-link {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            border-color: #3b82f6;
          }
        `}
      </style>
      
      <div className="site-wrap company-dashboard">
        <section className="dashboard-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1>Manage Jobs</h1>
                <div className="breadcrumb">
                  <a href="/company">Dashboard</a> 
                  <span className="mx-2">/</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>Manage Jobs</span>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '15px', 
                  padding: '1rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <small style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Manage your job postings</small>
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
                <h4>All Job Posts</h4>
                <Link to="/company/jobs/add" className="btn-modern btn-primary-modern">
                  <i className="icon-plus"></i>
                  Add New Job
                </Link>
              </div>
              <div className="card-body">
                {load ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : currentJobs.length === 0 ? (
                  <div className="text-center py-5">
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
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Job Title</th>
                            <th>Location</th>
                            <th>Salary</th>
                            <th>Status</th>
                            <th>Posted On</th>
                            <th>Applicants</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentJobs.map((job) => (
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
                              <td>
                                <span className={`status-badge ${job.status ? 'status-active' : 'status-inactive'}`}>
                                  {job.status ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td style={{ color: '#6b7280' }}>
                                {job.createdAt ? 
                                  new Date(job.createdAt.seconds * 1000).toLocaleDateString() : 
                                  'N/A'
                                }
                              </td>
                              <td>
                                <Link 
                                  to={`/company/viewapp/${job.id}`} 
                                  className="btn-modern btn-primary-modern"
                                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                >
                                  <i className="icon-users"></i>
                                  View Applicants
                                </Link>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Link 
                                    to={`/company/jobs/update/${job.id}`} 
                                    className="btn-modern btn-warning-modern"
                                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                  >
                                    <i className="icon-edit"></i>
                                    Edit
                                  </Link>
                                  <button 
                                    onClick={() => DeleteJobs(job.id)}
                                    className="btn-modern btn-danger-modern"
                                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                  >
                                    <i className="icon-trash"></i>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {totalPages > 1 && (
                      <nav>
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                              <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
