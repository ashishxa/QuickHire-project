import { Link } from "react-router-dom";

export default function AdminFooter() {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .admin-footer {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            color: white;
            position: relative;
            overflow: hidden;
          }
          
          .admin-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.3;
          }
          
          .admin-footer h3 {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            color: white;
            position: relative;
          }
          
          .admin-footer h3::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 30px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 1px;
          }
          
          .admin-footer ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .admin-footer ul li {
            margin-bottom: 0.75rem;
          }
          
          .admin-footer ul li a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.95rem;
            position: relative;
            padding-left: 0;
          }
          
          .admin-footer ul li a::before {
            content: '→';
            position: absolute;
            left: -15px;
            opacity: 0;
            transition: all 0.3s ease;
            color: rgba(255, 255, 255, 0.6);
          }
          
          .admin-footer ul li a:hover {
            color: white;
            padding-left: 15px;
            text-decoration: none;
          }
          
          .admin-footer ul li a:hover::before {
            opacity: 1;
          }
          
          .footer-social {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
          }
          
          .footer-social a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .footer-social a:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            color: white;
            text-decoration: none;
          }
          
          .footer-social a span {
            font-size: 1.2rem;
          }
          
          .copyright {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 2rem;
            margin-top: 2rem;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
          }
          
          .scroll-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            border: 2px solid rgba(255, 255, 255, 0.2);
          }
          
          .scroll-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
            color: white;
            text-decoration: none;
          }
          
          .scroll-top span {
            font-size: 1.5rem;
            font-weight: bold;
          }
          
          .admin-footer .container {
            position: relative;
            z-index: 1;
          }
          
          @media (max-width: 768px) {
            .admin-footer h3 {
              font-size: 1.1rem;
            }
            
            .footer-social {
              justify-content: center;
            }
            
            .scroll-top {
              bottom: 20px;
              right: 20px;
              width: 45px;
              height: 45px;
            }
          }
        `}
      </style>
      
      <footer className="admin-footer">
        <Link to="#top" className="scroll-top">
          <span className="icon-keyboard_arrow_up" />
        </Link>
        <div className="container">
          <div className="row mb-5">
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <h3>Admin Tools</h3>
              <ul>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/jobs/recentjob">Recent Jobs</Link>
                </li>
                <li>
                  <Link to="/admin/jobs/managejob">Manage Jobs</Link>
                </li>
                <li>
                  <Link to="/admin/jobs/managecompany">Manage Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs/manageuse">Manage Users</Link>
                </li>
                <li>
                  <Link to="/admin/jobs/viewapplication">View Applications</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <h3>Platform Stats</h3>
              <ul>
                <li>
                  <Link to="/admin">Total Jobs</Link>
                </li>
                <li>
                  <Link to="/admin">Total Users</Link>
                </li>
                <li>
                  <Link to="/admin">Total Companies</Link>
                </li>
                <li>
                  <Link to="/admin">Total Applications</Link>
                </li>
                <li>
                  <Link to="/admin">System Health</Link>
                </li>
                <li>
                  <Link to="/admin">Analytics</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <h3>Support</h3>
              <ul>
                <li>
                  <Link to="#">Admin Guide</Link>
                </li>
                <li>
                  <Link to="#">System Settings</Link>
                </li>
                <li>
                  <Link to="#">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="#">Terms of Service</Link>
                </li>
                <li>
                  <Link to="#">Help Center</Link>
                </li>
                <li>
                  <Link to="#">Contact Support</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <h3>Connect</h3>
              <div className="footer-social">
                <Link to="#">
                  <span className="icon-facebook" />
                </Link>
                <Link to="#">
                  <span className="icon-twitter" />
                </Link>
                <Link to="#">
                  <span className="icon-instagram" />
                </Link>
                <Link to="#">
                  <span className="icon-linkedin" />
                </Link>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
                <p style={{ margin: '0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  <strong>QuickHire Admin</strong><br/>
                  Platform Management System
                </p>
              </div>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-12">
              <p className="copyright">
                <small>
                  Copyright © 2025 QuickHire Admin Panel | All rights reserved | Ashish Kumar
                </small>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
