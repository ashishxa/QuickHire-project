import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navRef = useRef(null);

  // Check authentication status on component mount and when sessionStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const user = sessionStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUserType(userData.userType);
          setUserName(userData.name || userData.email || 'User');
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          sessionStorage.removeItem('user');
          setIsLoggedIn(false);
          setUserType(null);
          setUserName('');
        }
      } else {
        setIsLoggedIn(false);
        setUserType(null);
        setUserName('');
      }
    };

    // Check initial auth status
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically to catch login/logout from same tab
    const interval = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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
      if (isDropdownOpen && !event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleEmployerSignup = (e) => {
    e.preventDefault();
    navigate("/Register?userType=2");
  };

  const handleViewProfile = () => {
    // Convert userType to number for comparison since it's stored as number in sessionStorage
    const userTypeNum = parseInt(userType);
    
    if (userTypeNum === 1) {
      navigate("/admin");
    } else if (userTypeNum === 2) {
      navigate("/company");
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        setIsLoggedIn(false);
        setUserType(null);
        setUserName('');
        navigate("/");
        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        );
      }
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleViewProfileClick = () => {
    handleViewProfile();
    setIsDropdownOpen(false);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');
          
          .site-navbar {
            margin-bottom: 0px;
            z-index: 1999;
            position: fixed;
            width: 100%;
            top: 0;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(20px);
            background: ${scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)'};
            box-shadow: ${scrolled ? '0 8px 32px rgba(0, 0, 0, 0.12)' : '0 8px 32px rgba(0, 0, 0, 0.3)'};
            border: none !important;
            border-bottom: none !important;
            outline: none !important;
            font-family: 'Inter', sans-serif;
            line-height: 1;
          }
          
          .site-navbar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${scrolled ? 
              'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)' : 
              'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%)'
            };
            backdrop-filter: blur(20px);
            z-index: -1;
            border-radius: 0;
            border: none !important;
            border-bottom: none !important;
            outline: none !important;
          }
          
          .site-navbar .container-fluid {
            padding-left: 2rem;
            padding-right: 2rem;
          }
          
          @media (max-width: 1199.98px) {
            .site-navbar .container-fluid {
              padding-left: 1rem;
              padding-right: 1rem;
            }
          }
          
          .site-navbar .site-logo {
            position: absolute;
            left: 5%;
          }
          
          @media (max-width: 767.98px) {
            .site-navbar .site-logo {
              position: relative;
              left: auto;
            }
          }
          
          .site-navbar .site-logo a {
            color: ${scrolled ? '#0f172a' : '#fff'};
            font-size: 1.6rem;
            letter-spacing: .1rem;
            text-transform: uppercase;
            font-weight: 800;
            font-family: 'Poppins', sans-serif;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            position: relative;
            overflow: hidden;
          }
          
          .site-navbar .site-logo a::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.6s ease;
          }
          
          .site-navbar .site-logo a:hover::before {
            left: 100%;
          }
          
          .site-navbar .site-logo a:hover {
            text-decoration: none;
            transform: translateY(-3px) scale(1.02);
            color: ${scrolled ? '#3b82f6' : '#fbbf24'};
            text-shadow: ${scrolled ? '0 2px 8px rgba(59, 130, 246, 0.3)' : '0 4px 12px rgba(251, 191, 36, 0.5)'};
          }
          
          .site-navbar .site-logo svg {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            filter: ${scrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'};
            transform: rotate(0deg);
          }
          
          .site-navbar .site-logo a:hover svg {
            transform: scale(1.2) rotate(10deg);
            filter: ${scrolled ? 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4))' : 'drop-shadow(0 6px 12px rgba(251, 191, 36, 0.6))'};
          }
          
          .site-navbar .site-burger-menu, .site-navbar .right-cta-menu {
            position: absolute;
            right: 5%;
          }
          
          @media (max-width: 767.98px) {
            .site-navbar .site-burger-menu, .site-navbar .right-cta-menu {
              position: relative;
              right: auto;
            }
          }
          
          .site-navbar .site-menu-toggle {
            color: ${scrolled ? '#0f172a' : '#fff'};
            line-height: 0;
            font-size: 2.5rem;
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 12px;
            padding: 12px;
            text-shadow: ${scrolled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.3)'};
          }
          
          .site-navbar .site-menu-toggle:hover {
            background: ${scrolled ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.2)'};
            transform: scale(1.1) rotate(5deg);
            text-shadow: ${scrolled ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.4)'};
            box-shadow: ${scrolled ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 4px 12px rgba(255, 255, 255, 0.2)'};
          }
          
          @media (max-width: 767.98px) {
            .site-navbar .site-menu-toggle {
              margin-left: 5px;
            }
          }
          
          .site-navbar .site-navigation {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            z-index: 5;
          }
          
          .site-navbar .site-navigation .site-menu {
            margin-bottom: 0;
          }
          
          .site-navbar .site-navigation .site-menu .active {
            color: #fff;
            display: inline-block;
            padding: 5px 20px;
          }
          
          .site-navbar .site-navigation .site-menu a {
            text-decoration: none !important;
            display: inline-block;
            position: relative;
          }
          
          .site-navbar .site-navigation .site-menu > li {
            display: inline-block;
          }
          
          .site-navbar .site-navigation .site-menu > li > a {
            padding: 20px 24px !important;
            color: ${scrolled ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
            display: inline-block;
            text-decoration: none !important;
            font-weight: 600;
            font-size: 0.95rem;
            position: relative;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 12px;
            margin: 0 6px;
            text-shadow: ${scrolled ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.3)'};
            overflow: hidden;
          }
          
          .site-navbar .site-navigation .site-menu > li > a::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 3px;
            background: ${scrolled ? 'linear-gradient(135deg, #3b82f6, #1e40af)' : 'linear-gradient(135deg, #fbbf24, #f59e0b)'};
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(-50%);
            border-radius: 2px;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          }
          
          .site-navbar .site-navigation .site-menu > li > a::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
          }
          
          .site-navbar .site-navigation .site-menu > li > a:hover::after {
            left: 100%;
          }
          
          .site-navbar .site-navigation .site-menu > li > a:hover {
            color: ${scrolled ? '#0f172a' : '#fff'};
            transform: translateY(-3px);
            background: ${scrolled ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.15)'};
            text-shadow: ${scrolled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.4)'};
            box-shadow: ${scrolled ? '0 8px 25px rgba(59, 130, 246, 0.2)' : '0 8px 25px rgba(255, 255, 255, 0.1)'};
          }
          
          .site-navbar .site-navigation .site-menu > li > a:hover::before {
            width: 80%;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
          
          .site-navbar .site-navigation .site-menu > li > a.active {
            color: ${scrolled ? '#3b82f6' : '#fbbf24'};
            background: ${scrolled ? 'rgba(59, 130, 246, 0.15)' : 'rgba(251, 191, 36, 0.2)'};
            text-shadow: ${scrolled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.4)'};
            box-shadow: ${scrolled ? '0 8px 25px rgba(59, 130, 246, 0.25)' : '0 8px 25px rgba(251, 191, 36, 0.2)'};
          }
          
          .site-navbar .site-navigation .site-menu > li > a.active::before {
            width: 80%;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
          
          /* Enhanced Button Styles */
          .site-navbar .btn {
            border-radius: 50px;
            font-weight: 700;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            border: none;
            padding: 14px 28px;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          
          .site-navbar .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s ease;
          }
          
          .site-navbar .btn:hover::before {
            left: 100%;
          }
          
          .site-navbar .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          }
          
          .site-navbar .btn-primary:hover {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
            color: white;
          }
          
          .site-navbar .btn-warning {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
          }
          
          .site-navbar .btn-warning:hover {
            background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 35px rgba(245, 158, 11, 0.5);
            color: white;
          }
          
          .site-navbar .btn-outline-primary {
            background: transparent;
            color: ${scrolled ? '#3b82f6' : '#fff'};
            border: 2px solid ${scrolled ? '#3b82f6' : '#fff'};
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
            text-shadow: ${scrolled ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.3)'};
            backdrop-filter: blur(10px);
          }
          
          .site-navbar .btn-outline-primary:hover {
            background: ${scrolled ? '#3b82f6' : '#fff'};
            color: ${scrolled ? '#fff' : '#0f172a'};
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
            text-shadow: ${scrolled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.4)'};
          }
          
          /* Enhanced Dropdown Animation */
          .site-navbar .dropdown-menu {
            animation: slideDownEnhanced 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          @keyframes slideDownEnhanced {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.9);
              filter: blur(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0px);
            }
          }
          
          /* Mobile Menu Toggle */
          .site-navbar .site-menu-toggle {
            color: ${scrolled ? '#0f172a' : '#fff'};
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 12px;
            padding: 12px;
            text-shadow: ${scrolled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.3)'};
          }
          
          .site-navbar .site-menu-toggle:hover {
            background: ${scrolled ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.2)'};
            transform: scale(1.1) rotate(5deg);
            text-shadow: ${scrolled ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.4)'};
            box-shadow: ${scrolled ? '0 8px 25px rgba(59, 130, 246, 0.3)' : '0 8px 25px rgba(255, 255, 255, 0.2)'};
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .site-navbar {
              padding: 1rem 0;
            }
            
            .site-navbar .site-logo a {
              font-size: 1.3rem;
            }
            
            .site-navbar .btn {
              padding: 10px 20px;
              font-size: 0.8rem;
            }
          }
          
          /* Ensure no gaps or white lines */
          .site-navbar * {
            box-sizing: border-box;
          }
          
          /* Remove any potential white lines */
          .site-navbar,
          .site-navbar *,
          .site-navbar::before,
          .site-navbar::after {
            border-bottom: none !important;
            outline: none !important;
            border: none !important;
          }
          
          /* Additional border removal for all elements */
          .site-navbar .container-fluid,
          .site-navbar .row,
          .site-navbar .col-6,
          .site-navbar .site-logo,
          .site-navbar .site-navigation,
          .site-navbar .right-cta-menu {
            border: none !important;
            border-bottom: none !important;
            outline: none !important;
          }
          
          /* Ensure proper background coverage */
          .site-navbar {
            background-clip: padding-box;
            -webkit-background-clip: padding-box;
            border: none !important;
            border-bottom: none !important;
            outline: none !important;
            box-shadow: ${scrolled ? '0 8px 32px rgba(0, 0, 0, 0.12)' : '0 8px 32px rgba(0, 0, 0, 0.3)'};
          }
          
          /* Global border removal for header area */
          .site-navbar,
          .site-navbar *,
          .site-navbar::before,
          .site-navbar::after,
          .site-navbar .container-fluid,
          .site-navbar .row,
          .site-navbar .col-6,
          .site-navbar .site-logo,
          .site-navbar .site-navigation,
          .site-navbar .right-cta-menu,
          .site-navbar .btn,
          .site-navbar .dropdown,
          .site-navbar .dropdown-menu {
            border-bottom: none !important;
            border: none !important;
            outline: none !important;
          }
          
          /* Additional aggressive border removal */
          body {
            border: none !important;
            border-bottom: none !important;
            outline: none !important;
          }
          
          /* Target any element that might create a white line */
          * {
            box-sizing: border-box;
          }
          
          /* Ensure no white lines from any source */
          .site-navbar,
          .site-navbar *,
          .site-navbar::before,
          .site-navbar::after,
          .site-navbar .container-fluid,
          .site-navbar .row,
          .site-navbar .col-6,
          .site-navbar .site-logo,
          .site-navbar .site-navigation,
          .site-navbar .right-cta-menu,
          .site-navbar .btn,
          .site-navbar .dropdown,
          .site-navbar .dropdown-menu,
          .site-navbar .site-menu,
          .site-navbar .site-menu li,
          .site-navbar .site-menu a {
            border: none !important;
            border-bottom: none !important;
            border-top: none !important;
            border-left: none !important;
            border-right: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
          
          /* Enhanced dropdown items */
          .site-navbar .dropdown-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 12px;
            margin: 4px 8px;
            font-weight: 500;
            position: relative;
            overflow: hidden;
          }
          
          .site-navbar .dropdown-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
            transition: left 0.4s ease;
          }
          
          .site-navbar .dropdown-item:hover::before {
            left: 100%;
          }
          
          /* Floating animation for logo */
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          
          .site-navbar .site-logo a:hover svg {
            animation: float 2s ease-in-out infinite;
          }
        `}
      </style>
      <header className="site-navbar" style={{ 
        padding: scrolled ? '1.5rem 0' : '2rem 0',
        border: 'none',
        borderBottom: 'none',
        outline: 'none',
        margin: '0'
      }}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="site-logo col-6">
              <Link to="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                  className="bi bi-person-workspace" viewBox="0 0 16 16">
                  <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                  <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
                </svg> QuickHire
              </Link>
            </div>

            <nav className="mx-auto site-navigation">
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
                    <button className="btn btn-warning border-width-2 d-none d-lg-inline-block ml-3" onClick={handleEmployerSignup} style={{ fontWeight: 700 }}>
                      Sign Up as Employer
                    </button>
                  </>
                ) : (
                  <div className="d-flex align-items-center">
                    {/* User Profile Section */}
                    <div className="dropdown mr-3" style={{ position: 'relative' }}>
                      <button 
                        className="btn btn-outline-primary dropdown-toggle d-none d-lg-inline-block" 
                        type="button" 
                        onClick={toggleDropdown}
                        style={{ minWidth: '160px' }}
                      >
                        <i className="icon-user mr-2"></i>
                        {userName || 'Profile'}
                      </button>
                      {isDropdownOpen && (
                        <div className="dropdown-menu show" style={{ 
                          position: 'absolute', 
                          top: '100%', 
                          right: '0', 
                          zIndex: 1000,
                          minWidth: '240px',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(59, 130, 246, 0.1)',
                          borderRadius: '20px',
                          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                          padding: '1rem 0',
                          marginTop: '0.75rem',
                          backdropFilter: 'blur(20px)',
                          animation: 'slideDownEnhanced 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                          <Link className="dropdown-item" to="#" onClick={handleViewProfileClick} style={{
                            display: 'block',
                            padding: '1rem 1.5rem',
                            color: '#0f172a',
                            textDecoration: 'none',
                            backgroundColor: 'transparent',
                            border: '0',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderRadius: '12px',
                            margin: '0 0.5rem',
                            fontWeight: '600',
                            fontSize: '0.95rem'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                            e.target.style.transform = 'translateX(8px) scale(1.02)';
                            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.transform = 'translateX(0) scale(1)';
                            e.target.style.boxShadow = 'none';
                          }}
                          >
                            <i className="icon-person mr-2" style={{ color: '#3b82f6' }}></i> View Profile
                          </Link>
                          <div className="dropdown-divider" style={{
                            height: '0',
                            margin: '1rem 0.5rem',
                            borderTop: '1px solid rgba(59, 130, 246, 0.1)'
                          }}></div>
                          <Link className="dropdown-item" to="#" onClick={handleLogout} style={{
                            display: 'block',
                            padding: '1rem 1.5rem',
                            color: '#dc2626',
                            textDecoration: 'none',
                            backgroundColor: 'transparent',
                            border: '0',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderRadius: '12px',
                            margin: '0 0.5rem',
                            fontWeight: '600',
                            fontSize: '0.95rem'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                            e.target.style.transform = 'translateX(8px) scale(1.02)';
                            e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.transform = 'translateX(0) scale(1)';
                            e.target.style.boxShadow = 'none';
                          }}
                          >
                            <i className="icon-sign-out mr-2" style={{ color: '#dc2626' }}></i> Logout
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <a href="#" className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3">
                <span className="icon-menu h3 m-0 p-0 mt-2"></span>
              </a>
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer for fixed navbar */}
      <div style={{ 
        height: scrolled ? '100px' : '120px',
        transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        borderBottom: 'none',
        outline: 'none',
        background: 'transparent',
        margin: '0',
        padding: '0',
        boxSizing: 'border-box'
      }}></div>
    </>
  );
}
