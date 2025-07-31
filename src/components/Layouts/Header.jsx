import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  // Check login status when component mounts
  useEffect(() => {
    const loginStatus = sessionStorage.getItem("isLogin");
    const userTypeValue = sessionStorage.getItem("userType");

    setIsLoggedIn(loginStatus === "true");
    setUserType(userTypeValue);
  }, []);

  const handleEmployerSignup = (e) => {
    e.preventDefault();
    navigate("/Register?userType=2");
  };

  const handleViewProfile = () => {
    if (userType === "1") {
      navigate("/admin");
    } else if (userType === "2") {
      navigate("/company");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        setIsLoggedIn(false);
        setUserType(null);
        navigate("/");
        Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success');
      }
    });
  };

  return (
    <>
      <header className="site-navbar mt-3">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="site-logo col-6">
              <Link to="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-workspace" viewBox="0 0 16 16">
                  <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                  <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
                </svg> Quick Hire
              </Link>
            </div>

            <nav className="site-navigation">
              <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/jobs">Jobs</Link> </li>

                {!isLoggedIn ? (
                  <>
                    <li className="d-lg-none"><Link to="/Register"><span className="mr-2">+</span> Register</Link></li>
                    <li className="d-lg-none"><Link to="/login">Log In</Link></li>
                  </>
                ) : (
                  <>
                    <li className="d-lg-none"><Link to="#" onClick={handleViewProfile}>View Profile</Link></li>
                    <li className="d-lg-none"><Link to="#" onClick={handleLogout}>Logout</Link></li>
                  </>
                )}
              </ul>
            </nav>

            <div className="right-cta-menu text-right d-flex align-items-center col-6">
              <div className="ml-auto">
                {!isLoggedIn ? (
                  <>
                    <Link to="/login" className="btn btn-primary border-width-2 d-none d-lg-inline-block">
                      <span className="mr-2 icon-lock_outline" /> Log In
                    </Link>
                    <button className="btn btn-warning border-width-2 d-none d-lg-inline-block ml-2" onClick={handleEmployerSignup} style={{ fontWeight: 600 }}>
                      Sign Up as Employer
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary border-width-2 d-none d-lg-inline-block" onClick={handleViewProfile}>
                      <span className="mr-2 icon-user" /> View Profile
                    </button>
                    <button className="btn btn-danger border-width-2 d-none d-lg-inline-block ml-2" onClick={handleLogout}>
                      <span className="mr-2 icon-lock_outline" /> Logout
                    </button>
                  </>
                )}
              </div>

              <Link to="#" className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3">
                <span className="icon-menu h3 m-0 p-0 mt-2" />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
