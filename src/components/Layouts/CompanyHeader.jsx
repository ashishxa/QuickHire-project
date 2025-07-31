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
      <header className="site-navbar mt-3">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="site-logo col-6">
              <Link to="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-workspace" viewBox="0 0 16 16">
                  <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                  <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
                </svg> Quick Hire
              </Link>
            </div>

            <nav className="mx-auto site-navigation">
              <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                
                <li><Link to="jobs/add">Add Jobs</Link></li>
                <li className="has-children">
                  <Link to="#">Jobs</Link>
                  <ul className="dropdown">

                    <li><Link to="jobs/managejobs">Manage Jobs</Link></li>
                    <li><Link to="manageuser">Manage User</Link></li>
                    
                  </ul>
                </li>
                <li><Link to="viewapp">View Application</Link></li>
                <li>
                  <Link to="/login" className="nav-Link" onClick={logout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
