import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../Firebase";
import { PacmanLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function About() {
  const [usersCount, setUsersCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const sectionsRef = useRef([]);

  // Add intersection observer for animation on scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Jobs - Set up real-time listener
        const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
          console.log("Jobs fetched:", snapshot.size);
          setJobsCount(snapshot.size);
        }, (error) => {
          console.error("Error fetching jobs:", error);
          setJobsCount(0);
        });
        
        // Users - Set up real-time listener
        const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
          const userCount = snapshot.docs.filter(doc => {
            const data = doc.data();
            return data && data.userType === 3;
          }).length;
          console.log("Users fetched:", userCount, "Total users:", snapshot.size);
          setUsersCount(userCount);
        }, (error) => {
          console.error("Error fetching users:", error);
          setUsersCount(0);
        });
        
        // Companies - Set up real-time listener for users with userType 2
        const unsubCompanies = onSnapshot(
          query(collection(db, "users"), where("userType", "==", 2)),
          (snapshot) => {
            console.log("Companies fetched:", snapshot.size);
            setCompaniesCount(snapshot.size);
          },
          (error) => {
            console.error("Error fetching companies:", error);
            setCompaniesCount(0);
          }
        );

        // Applications - Set up real-time listener
        const unsubApplications = onSnapshot(collection(db, "applications"), (snapshot) => {
          console.log("Applications fetched:", snapshot.size);
          setApplicationsCount(snapshot.size);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching applications:", error);
          setApplicationsCount(0);
          setLoading(false);
        });
        
        // Set a timeout to stop loading if data doesn't load within 10 seconds
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 10000);
        
        // Clean up listeners when component unmounts
        return () => {
          unsubJobs();
          unsubUsers();
          unsubCompanies();
          unsubApplications();
          clearTimeout(timeout);
        };
      } catch (error) {
        console.error("Error setting up Firebase listeners:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
          }
          
          .about-hero {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            padding: 120px 0 80px;
            color: white;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .about-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
            opacity: 0.3;
          }
          
          .about-hero h1 {
            font-size: 3.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            opacity: 0;
            animation: fadeInUp 1s ease forwards;
          }
          
          .about-hero p {
            font-size: 1.3rem;
            opacity: 0;
            margin-bottom: 2rem;
            animation: fadeInUp 1s 0.3s ease forwards;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 0.9;
              transform: translateY(0);
            }
          }
          
          .stats-section {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 80px 0;
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
          
          .stat-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            transition: all 0.4s ease;
            margin-bottom: 2rem;
            opacity: 0;
            transform: translateY(30px);
            position: relative;
            overflow: hidden;
          }
          
          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
            transition: left 0.6s ease;
          }
          
          .stat-card:hover::before {
            left: 100%;
          }
          
          .animate-on-scroll.animate .stat-card:nth-child(1) { animation: slideInUp 0.6s 0.1s ease forwards; }
          .animate-on-scroll.animate .stat-card:nth-child(2) { animation: slideInUp 0.6s 0.2s ease forwards; }
          .animate-on-scroll.animate .stat-card:nth-child(3) { animation: slideInUp 0.6s 0.3s ease forwards; }
          .animate-on-scroll.animate .stat-card:nth-child(4) { animation: slideInUp 0.6s 0.4s ease forwards; }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .stat-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
          }
          
          .stat-number {
            font-size: 3rem;
            font-weight: 900;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
            display: inline-block;
            position: relative;
          }
          
          .stat-number::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            border-radius: 3px;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.5s ease;
          }
          
          .stat-card:hover .stat-number::after {
            transform: scaleX(1);
          }
          
          .stat-label {
            font-size: 1.1rem;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .stat-description {
            font-size: 0.9rem;
            color: #6b7280;
            margin-top: 0.5rem;
            font-style: italic;
          }
          
          .mission-section {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
            padding: 80px 0;
            color: white;
            position: relative;
            overflow: hidden;
          }
          
          .mission-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          }
          
          .mission-title {
            position: relative;
            display: inline-block;
            margin-bottom: 2rem;
            opacity: 0;
          }
          
          .animate-on-scroll.animate .mission-title { animation: fadeInUp 0.6s ease forwards; }
          
          .mission-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 60px;
            height: 3px;
            background: #87ceeb;
            border-radius: 3px;
          }
          
          .feature-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.4s ease;
            height: 100%;
            margin-bottom: 2rem;
            opacity: 0;
            transform: translateY(30px);
          }
          
          .animate-on-scroll.animate .feature-card:nth-child(1) { animation: slideInUp 0.6s 0.1s ease forwards; }
          .animate-on-scroll.animate .feature-card:nth-child(2) { animation: slideInUp 0.6s 0.2s ease forwards; }
          .animate-on-scroll.animate .feature-card:nth-child(3) { animation: slideInUp 0.6s 0.3s ease forwards; }
          
          .feature-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }
          
          .feature-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
            transition: all 0.4s ease;
          }
          
          .feature-card:hover .feature-icon {
            transform: scale(1.1) rotate(5deg);
          }
          
          .story-section {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            padding: 80px 0;
            position: relative;
            overflow: hidden;
          }
          
          .story-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
          }
          
          .story-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            text-align: center;
            transition: all 0.4s ease;
          }
          
          .story-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
          }
          
          .team-section {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 80px 0;
            position: relative;
            overflow: hidden;
          }
          
          .team-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
          }
          
          .team-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            transition: all 0.4s ease;
            margin-bottom: 2rem;
            opacity: 0;
            transform: translateY(30px);
          }
          
          .animate-on-scroll.animate .team-card:nth-child(1) { animation: slideInUp 0.6s 0.1s ease forwards; }
          .animate-on-scroll.animate .team-card:nth-child(2) { animation: slideInUp 0.6s 0.2s ease forwards; }
          .animate-on-scroll.animate .team-card:nth-child(3) { animation: slideInUp 0.6s 0.3s ease forwards; }
          
          .team-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
          }
          
          .team-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 auto 1.5rem;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
            transition: all 0.4s ease;
          }
          
          .team-card:hover .team-avatar {
            transform: scale(1.1);
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .btn-primary-custom {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            border: none;
            color: white;
            padding: 12px 30px;
            border-radius: 25px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.4s ease;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          }
          
          .btn-primary-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
            color: white;
            text-decoration: none;
          }
          
          .lead {
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.6;
          }
          
          .mb-3 { margin-bottom: 1rem !important; }
          .mb-4 { margin-bottom: 1.5rem !important; }
          .mb-5 { margin-bottom: 3rem !important; }
          .mt-4 { margin-top: 1.5rem !important; }
          .text-center { text-align: center !important; }
          .align-items-center { align-items: center !important; }
          .mb-lg-0 { margin-bottom: 0 !important; }
          
          @media (max-width: 768px) {
            .about-hero h1 {
              font-size: 2.5rem;
            }
            
            .about-hero p {
              font-size: 1.1rem;
            }
            
            .stat-number {
              font-size: 2.5rem;
            }
            
            .feature-card, .team-card {
              margin-bottom: 1.5rem;
            }
          }
        `}
      </style>
      
      <div className="site-wrap">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1>About QuickHire</h1>
                <p>Revolutionizing the way talent meets opportunity. We're building the future of recruitment.</p>
                <div style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '25px', padding: '1rem 2rem', display: 'inline-block' }}>
                  <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
                  <span style={{ margin: '0 10px', color: 'white' }}>/</span>
                  <span style={{ color: 'white' }}>About Us</span>
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
                Loading platform statistics...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <section className="stats-section animate-on-scroll">
              <div className="container">
                <div className="row text-center mb-5">
                  <div className="col-12">
                    <h2 className="gradient-text mb-3" style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                      QuickHire Platform Statistics
                    </h2>
                    <p className="lead" style={{ color: '#374151', fontSize: '1.2rem' }}>
                      Real-time data showing our platform's growth and impact
                    </p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <div className="stat-card">
                      <div className="stat-number">{usersCount || 0}</div>
                      <div className="stat-label">Active Candidates</div>
                      <div className="stat-description">Job seekers ready for opportunities</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="stat-card">
                      <div className="stat-number">{jobsCount || 0}</div>
                      <div className="stat-label">Jobs Posted</div>
                      <div className="stat-description">Active job opportunities</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="stat-card">
                      <div className="stat-number">{companiesCount || 0}</div>
                      <div className="stat-label">Partner Companies</div>
                      <div className="stat-description">Employers using our platform</div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="stat-card">
                      <div className="stat-number">{applicationsCount || 0}</div>
                      <div className="stat-label">Applications</div>
                      <div className="stat-description">Successful job applications</div>
                    </div>
                  </div>
                </div>
                
                {(usersCount === 0 && jobsCount === 0 && companiesCount === 0 && applicationsCount === 0) && (
                  <div className="row mt-4">
                    <div className="col-12 text-center">
                      <div style={{ 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        border: '1px solid rgba(59, 130, 246, 0.2)', 
                        borderRadius: '12px', 
                        padding: '2rem',
                        color: '#374151'
                      }}>
                        <i className="icon-info" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '1rem' }}></i>
                        <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Platform Statistics</h4>
                        <p style={{ margin: '0', opacity: '0.8', marginBottom: '1rem' }}>
                          Statistics will appear here once users start registering and posting jobs.
                        </p>
                        <div style={{ 
                          background: 'rgba(16, 185, 129, 0.1)', 
                          border: '1px solid rgba(16, 185, 129, 0.2)', 
                          borderRadius: '8px', 
                          padding: '1rem',
                          fontSize: '0.9rem'
                        }}>
                          <strong>Debug Info:</strong><br/>
                          Jobs Count: {jobsCount}<br/>
                          Users Count: {usersCount}<br/>
                          Companies Count: {companiesCount}<br/>
                          Applications Count: {applicationsCount}<br/>
                          Loading State: {loading ? 'Loading...' : 'Loaded'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section animate-on-scroll">
              <div className="container">
                <div className="row text-center mb-5">
                  <div className="col-12">
                    <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: '800', textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
                      Our Mission & Values
                    </h2>
                    <p className="lead" style={{ fontSize: '1.2rem', opacity: '0.9' }}>
                      We're committed to making job hunting and hiring faster, smarter, and more efficient
                    </p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="feature-card">
                      <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}>
                        <i className="icon-bolt" style={{ fontSize: '2rem', color: 'white' }}></i>
                      </div>
                      <h4 style={{ fontWeight: '600' }}>Speed & Efficiency</h4>
                      <p style={{ opacity: '0.9' }}>
                        We believe in connecting talent with opportunities instantly. Our AI-powered platform matches candidates with jobs in minutes, not days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6">
                    <div className="feature-card">
                      <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' }}>
                        <i className="icon-target" style={{ fontSize: '2rem', color: 'white' }}></i>
                      </div>
                      <h4 style={{ fontWeight: '600' }}>Smart Matching</h4>
                      <p style={{ opacity: '0.9' }}>
                        Advanced algorithms ensure perfect matches between candidates and companies, leading to higher success rates and satisfaction.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6">
                    <div className="feature-card">
                      <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <i className="icon-shield" style={{ fontSize: '2rem', color: 'white' }}></i>
                      </div>
                      <h4 style={{ fontWeight: '600' }}>Trust & Security</h4>
                      <p style={{ opacity: '0.9' }}>
                        Your data and privacy are our top priorities. We use enterprise-grade security to protect all user information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Story Section */}
            <section className="story-section animate-on-scroll">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6 mb-5 mb-lg-0">
                    <div className="story-card">
                      <i className="icon-lightbulb" style={{ fontSize: '4rem', marginBottom: '1rem', color: '#3b82f6' }}></i>
                      <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>Our Story</h3>
                      <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
                        QuickHire was born from a simple idea - job hunting should be fast, efficient, and enjoyable. 
                        We've revolutionized the recruitment process by combining cutting-edge technology with human-centered design.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <h2 className="gradient-text mb-4" style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                      Building the Future of Recruitment
                    </h2>
                    <p className="lead mb-4" style={{ color: '#374151', fontSize: '1.2rem' }}>
                      QuickHire is more than just a job board. We're a comprehensive platform that connects talented professionals with innovative companies worldwide.
                    </p>
                    <p style={{ color: '#6b7280', lineHeight: '1.8' }}>
                      Our platform leverages artificial intelligence and machine learning to create meaningful connections between job seekers and employers. 
                      We understand that every career move is significant, and we're here to make that journey as smooth and successful as possible.
                    </p>
                    <div className="mt-4">
                      <Link to="/jobs" className="btn btn-primary-custom">
                        Explore Opportunities
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Team Section */}
            <section className="team-section animate-on-scroll">
              <div className="container">
                <div className="row text-center mb-5">
                  <div className="col-12">
                    <h2 className="gradient-text mb-3" style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                      Meet Our Team
                    </h2>
                    <p className="lead" style={{ color: '#374151', fontSize: '1.2rem' }}>
                      The passionate professionals behind QuickHire's success
                    </p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="team-card">
                      <div className="team-avatar">JD</div>
                      <h4 style={{ color: '#1e293b', fontWeight: '600' }}>John Doe</h4>
                      <p style={{ color: '#3b82f6', fontWeight: '500' }}>CEO & Founder</p>
                      <p style={{ color: '#6b7280' }}>
                        Visionary leader with 15+ years in tech and recruitment. Passionate about connecting talent with opportunity.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6">
                    <div className="team-card">
                      <div className="team-avatar">JS</div>
                      <h4 style={{ color: '#1e293b', fontWeight: '600' }}>Jane Smith</h4>
                      <p style={{ color: '#3b82f6', fontWeight: '500' }}>CTO</p>
                      <p style={{ color: '#6b7280' }}>
                        Technology expert specializing in AI and machine learning. Leads our innovative matching algorithms.
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-6">
                    <div className="team-card">
                      <div className="team-avatar">MJ</div>
                      <h4 style={{ color: '#1e293b', fontWeight: '600' }}>Mike Johnson</h4>
                      <p style={{ color: '#3b82f6', fontWeight: '500' }}>Head of Operations</p>
                      <p style={{ color: '#6b7280' }}>
                        Operations specialist ensuring smooth platform performance and exceptional user experience.
                      </p>
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
