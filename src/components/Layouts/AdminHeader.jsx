import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";

export default function AdminHeader() {
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.admin-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logout = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        Swal.fire({
          title: "Logged Out!",
          text: "Logout successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
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
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          .admin-header {
            background: ${scrolled ? 
              'linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)' : 
              'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'};
            padding: ${scrolled ? '0.75rem 0' : '1rem 0'};
            box-shadow: ${scrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.1)'};
            position: sticky;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
            backdrop-filter: ${scrolled ? 'blur(10px)' : 'none'};
          }
          
          .admin-logo {
            color: white;
            font-weight: 700;
            font-size: ${scrolled ? '1.3rem' : '1.5rem'};
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            text-decoration: none;
          }
          
          .admin-logo:hover {
            transform: translateY(-2px);
            color: white;
            text-decoration: none;
          }
          
          .admin-logo svg {
            width: ${scrolled ? '20px' : '24px'};
            height: ${scrolled ? '20px' : '24px'};
            transition: all 0.3s ease;
          }
          
          .admin-logo:hover svg {
            transform: scale(1.1) rotate(5deg);
          }
          
          .admin-nav {
            display: flex;
            gap: 1.5rem;
            align-items: center;
          }
          
          .admin-nav-link {
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            position: relative;
            padding: 0.5rem 0;
            transition: all 0.3s ease;
            text-decoration: none;
            font-size: 0.95rem;
          }
          
          .admin-nav-link:hover {
            color: white;
            text-decoration: none;
            transform: translateY(-1px);
          }
          
          .admin-nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: white;
            transition: width 0.3s ease;
            border-radius: 1px;
          }
          
          .admin-nav-link:hover::after {
            width: 100%;
          }
          
          .admin-dropdown {
            position: relative;
            display: inline-block;
          }
          
          .admin-dropdown-toggle {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            padding: 0.5rem 0;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
          
          .admin-dropdown-toggle:hover {
            color: white;
            transform: translateY(-1px);
          }
          
          .admin-dropdown-toggle::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: white;
            transition: width 0.3s ease;
            border-radius: 1px;
          }
          
          .admin-dropdown-toggle:hover::after {
            width: 100%;
          }
          
          .admin-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            padding: 0.5rem 0;
            min-width: 200px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            border: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          .admin-dropdown-menu.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
          
          .admin-dropdown-item {
            display: block;
            padding: 0.75rem 1.5rem;
            color: #374151;
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 500;
            border-bottom: 1px solid rgba(59, 130, 246, 0.05);
          }
          
          .admin-dropdown-item:last-child {
            border-bottom: none;
          }
          
          .admin-dropdown-item:hover {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%);
            color: #1e40af;
            text-decoration: none;
            transform: translateX(5px);
          }
          
          .logout-btn {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            backdrop-filter: blur(10px);
          }
          
          .logout-btn:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            color: white;
            text-decoration: none;
          }
          
          .mobile-menu-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          
          .mobile-menu-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
          }
          
          @media (max-width: 768px) {
            .admin-nav {
              display: none;
            }
            
            .mobile-menu-btn {
              display: block;
            }
          }
          
          @media (min-width: 769px) {
            .mobile-menu-btn {
              display: none;
            }
          }
        `}
      </style>
      
      <header className="admin-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-6">
              <Link to="/admin" className="admin-logo">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  className="bi bi-person-workspace" viewBox="0 0 16 16">
                  <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                  <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
                </svg> Quick Hire Admin
              </Link>
            </div>

            <div className="col-6 text-end">
              <nav className="admin-nav d-none d-md-flex justify-content-end">
                <Link to="/admin" className="admin-nav-link">Dashboard</Link>
                <Link to="/admin/jobs/recentjob" className="admin-nav-link">Recent Jobs</Link>
                
                <div className="admin-dropdown" ref={dropdownRef}>
                  <button className="admin-dropdown-toggle" onClick={toggleDropdown}>
                    Manage
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                  </button>
                  
                  <div className={`admin-dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                    <Link to="/admin/jobs/managecompany" className="admin-dropdown-item">Manage Company</Link>
                    <Link to="/admin/jobs/manageuse" className="admin-dropdown-item">Manage User</Link>
                   
                  </div>
                </div>
                
                <a href="/logout" onClick={logout} className="logout-btn">
                  Logout
                </a>
              </nav>
              
              <div className="d-md-none">
                <button className="mobile-menu-btn">
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
