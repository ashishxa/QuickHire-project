import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CompanyHeader() {
  const nav = useNavigate();

  const logout = (e) => {
    e.preventDefault(); // prevent link navigation
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        Swal.fire({
          title: "Logged Out!",
          text: "Logout successfully.",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          nav("/login");
        });
      }
    });
  };

  return (
    <>
      <style>
        {`
          .company-header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            padding: 1rem 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
          }
          
          .company-logo {
            color: white;
            font-weight: 700;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
          }
          
          .company-logo:hover {
            transform: translateY(-2px);
            text-decoration: none;
            color: white;
          }
          
          .company-logo svg {
            width: 24px;
            height: 24px;
            transition: all 0.3s ease;
          }
          
          .company-logo:hover svg {
            transform: scale(1.1);
          }
          
          .company-nav {
            display: flex;
            gap: 1.5rem;
          }
          
          .company-nav-link {
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
            position: relative;
            padding: 0.5rem 0;
            transition: all 0.3s ease;
          }
          
          .company-nav-link:hover {
            color: white;
            text-decoration: none;
          }
          
          .company-nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: white;
            transition: width 0.3s ease;
          }
          
          .company-nav-link:hover::after {
            width: 100%;
          }
        `}
      </style>
      <header className="company-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-6">
              <Link to="/company" className="company-logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-workspace" viewBox="0 0 16 16">
                  <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                  <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
                </svg> Quick Hire
              </Link>
            </div>

            <div className="col-6 text-end">
              <nav className="company-nav d-none d-md-flex justify-content-end">
                <Link to="/company" className="company-nav-link">Dashboard</Link>
                <Link to="/company/jobs/add" className="company-nav-link">Add Jobs</Link>
                <Link to="/company/jobs/managejobs" className="company-nav-link">Manage Jobs</Link>
                <Link to="/login" className="company-nav-link" onClick={logout}>Logout</Link>
              </nav>
              
              <div className="d-md-none">
                <button className="btn btn-sm btn-outline-light">
                  <i className="icon-menu"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
