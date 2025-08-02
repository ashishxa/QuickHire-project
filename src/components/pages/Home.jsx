import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../Firebase";
import { Link, useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

export default function Home() {
  // =========================
  // State and Firestore Logic
  // =========================
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [apply, setApply] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    query: "",
    region: "",
    jobType: ""
  });
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const navigate = useNavigate();

  console.log('Home component rendering, error:', error);

    useEffect(() => {
    try {
      console.log('Setting up Firebase listeners...');
      // Jobs - Set up real-time listener
      const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
        try {
          console.log('Jobs snapshot received:', snapshot.size, 'documents');
          const jobsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setJobs(jobsData);
          setFilteredJobs(jobsData); // Initialize filtered jobs with all jobs
          
          // Extract unique locations from jobs data
          const locations = [...new Set(jobsData.map(job => job.location).filter(Boolean))];
          console.log('Extracted locations:', locations);
          setUniqueLocations(locations.sort());
          
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('Error processing jobs data:', err);
          setError(err.message);
          setLoading(false);
        }
      }, (error) => {
        console.error('Error fetching jobs:', error);
        setError(error.message);
        setLoading(false);
      });
    
    // Users - Set up real-time listener
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsersCount(snapshot.docs.filter(doc => doc.data().userType === 3).length);
    });
    
    // Companies - Set up real-time listener for users with userType 2
    const unsubCompanies = onSnapshot(
      query(collection(db, "users"), where("userType", "==", 2)),
      (snapshot) => {
        setCompaniesCount(snapshot.size);
      }
    );
    
    // Applications - Set up real-time listener
    const userId = sessionStorage.getItem("userId");
    let unsubApplications;
    if (userId) {
      unsubApplications = onSnapshot(
        query(collection(db, "applications"), where("userId", "==", userId)),
        (snapshot) => {
          setApply(snapshot.docs.map((doc) => doc.data().jobId));
        }
      );
    }
    
    // Clean up listeners when component unmounts
    return () => {
      unsubJobs();
      unsubUsers();
      unsubCompanies();
      if (unsubApplications) unsubApplications();
    };
    } catch (error) {
      console.error('Error setting up Firebase listeners:', error);
      setLoading(false);
    }
  }, []);

  // Re-perform search when jobs data changes
  useEffect(() => {
    if (jobs.length > 0 && (searchParams.query || searchParams.region || searchParams.jobType)) {
      performSearch(searchParams);
    }
  }, [jobs]);

  // Initialize Bootstrap Select plugin when component mounts
  useEffect(() => {
    const initializeSelectPicker = () => {
      // Check if Bootstrap Select is available
      if (window.jQuery && window.jQuery.fn.selectpicker) {
        // Initialize Bootstrap Select
        window.jQuery('.selectpicker').selectpicker('refresh');
        console.log('Bootstrap Select refreshed');
      } else {
        // If jQuery or Bootstrap Select is not loaded yet, try again after a short delay
        setTimeout(initializeSelectPicker, 100);
      }
    };

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initializeSelectPicker, 50);
    
    return () => clearTimeout(timer);
  }, [uniqueLocations]); // Re-run when locations change

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchParams);
  };

  // Handle input changes for search form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newSearchParams = {
      ...searchParams,
      [name]: value
    };
    setSearchParams(newSearchParams);
    
    // Real-time search for query field
    if (name === 'query') {
      performSearch(newSearchParams);
    }
  };

  // Handle dropdown changes
  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    const newSearchParams = {
      ...searchParams,
      [name]: value
    };
    setSearchParams(newSearchParams);
    
    // Perform search when dropdowns change
    performSearch(newSearchParams);
  };

  // Perform search with given parameters
  const performSearch = (params) => {
    console.log('Searching with params:', params);
    console.log('Available jobs:', jobs.length);
    
    const filtered = jobs.filter(job => {
      const query = params.query.toLowerCase().trim();
      const region = params.region.toLowerCase().trim();
      const jobType = params.jobType;
      
      // Query matching - search in title, company, and description
      const matchQuery = query === "" || 
        (job.jobTitle && job.jobTitle.toLowerCase().includes(query)) ||
        (job.company && job.company.toLowerCase().includes(query)) ||
        (job.description && job.description.toLowerCase().includes(query));
      
      // Region matching - exact match or "Anywhere"
      const matchRegion = region === "" || region === "anywhere" ||
        (job.location && job.location.toLowerCase().includes(region));
      
      // Job type matching
      const matchType = jobType === "" || job.type === jobType;
      
      const matches = matchQuery && matchRegion && matchType;
      
      if (query !== "" && matches) {
        console.log('Job matches search:', job.jobTitle, 'Query:', query);
      }
      
      return matches;
    });
    
    console.log('Filtered jobs:', filtered.length);
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  // Clear search and show all jobs
  const handleClearSearch = () => {
    setSearchParams({
      query: "",
      region: "",
      jobType: ""
    });
    setFilteredJobs(jobs);
    setCurrentPage(1);
  };

  // Handle Apply button click
  const handleApply = (jobId) => {
    const isLogin = sessionStorage.getItem("isLogin");
    if (!isLogin) {
      navigate("/login");
    } else {
      navigate(`/ApplyJobs/${jobId}`);
    }
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // =========================
  // Render
  // =========================
  
  // Show error if there is one
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>Error Loading Page</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Loading Quick Hire...</h1>
        <p>Please wait while we load the latest jobs...</p>
        <div style={{ marginTop: '20px' }}>
          <div style={{ width: '50px', height: '50px', border: '3px solid #f3f3f3', borderTop: '3px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  try {
    return (
      <>
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');
          

          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
          }
          
          .site-wrap {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          }
          
          .section-hero {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3b82f6 100%) !important;
            position: relative;
            overflow: hidden;
          }
          
          .section-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          
          .display-4 {
            font-family: 'Poppins', sans-serif;
            font-weight: 800;
            background: linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .lead {
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.9) !important;
          }
          
          .form-control {
            border: 2px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          .form-control:focus {
            border-color: #87ceeb;
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 0.2rem rgba(135, 206, 235, 0.25);
          }
          
          .form-control::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
          
          .btn-search {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
            border: none;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          }
          
          .btn-search:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
          }
          
          .btn-outline-light {
            border: 2px solid rgba(255, 255, 255, 0.8);
            color: white;
            font-weight: 500;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .btn-outline-light::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .btn-outline-light:hover::before {
            left: 100%;
          }
          
          .btn-outline-light:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            color: white !important;
            transform: scale(1.05);
            border-color: #87ceeb;
          }
          
          .site-section {
            background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          }
          
          .section-title {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            color: #1e3c72 !important;
            position: relative;
          }
          
          .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border-radius: 2px;
          }
          
          .card {
            border: none;
            border-radius: 16px;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            overflow: hidden;
          }
          
          .card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 12px 30px rgba(37, 99, 235, 0.15) !important;
          }
          
          .card-title {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            color: #1e3c72 !important;
          }
          
          .badge {
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
          }
          
          .badge-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }
          
          .badge-warning {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border: none;
            font-weight: 600;
            border-radius: 12px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          }
          
          .btn-primary:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
          }
          
          .bg-image.overlay-primary {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3b82f6 100%) !important;
          }
          
          .number {
            font-family: 'Poppins', sans-serif;
            font-weight: 800;
            animation: countUp 2s ease-out;
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          @keyframes countUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
          
          .company-logo-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
          }
          
          .company-logo-container:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
          }
          
          .custom-pagination button {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border: none;
            color: white;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 8px;
            margin: 0 4px;
            transition: all 0.3s ease;
          }
          
          .custom-pagination button:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            transform: translateY(-2px);
          }
          
          .custom-pagination button.active {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4);
          }
        `}
      </style>
      <div className="site-wrap">
        {/* =========================
            Hero Section
        ========================= */}
        <div className="site-mobile-menu site-navbar-target">
          <div className="site-mobile-menu-header">
            <div className="site-mobile-menu-close mt-3">
              <span className="icon-close2 js-menu-toggle" />
            </div>
          </div>
          <div className="site-mobile-menu-body" />
        </div>

                 <section
           className="home-section section-hero overlay bg-image"
           style={{ 
             background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3b82f6 100%)',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundAttachment: 'fixed',
             position: 'relative',
             overflow: 'hidden'
           }}
           id="home-section"
         >
           <div style={{
             position: 'absolute',
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.85) 0%, rgba(59, 130, 246, 0.75) 100%)',
             opacity: 1
           }}></div>
          
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-12">
                <div className="mb-5 text-center">
                  <h1 className="text-white font-weight-bold display-4 mb-4" style={{ 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                    fontSize: '3.2rem',
                    fontWeight: '700',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.3',
                    color: '#ffffff',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    The Easiest Way To Get Your Dream Job
                  </h1>
                  <p className="lead text-white mb-5" style={{ 
                    fontSize: '1.3rem', 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    fontWeight: '400',
                    lineHeight: '1.6',
                    opacity: '0.9',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    Connect with top companies and find the perfect opportunity that matches your skills and aspirations
                  </p>
                </div>
                <form onSubmit={handleSearch} className="search-jobs-form">
                  <div className="row mb-5">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                                             <div className="position-relative">
                      <input
                        type="text"
                           className="form-control form-control-lg shadow-sm"
                        placeholder="Job title, Company..."
                        name="query"
                        value={searchParams.query}
                        onChange={handleInputChange}
                           style={{ 
                             borderRadius: '8px', 
                             border: 'none',
                             paddingRight: searchParams.query ? '40px' : '12px'
                           }}
                         />
                         {searchParams.query && (
                           <div 
                             className="position-absolute"
                             style={{ 
                               right: '12px', 
                               top: '50%', 
                               transform: 'translateY(-50%)',
                               color: '#1976d2',
                               fontSize: '14px',
                               cursor: 'pointer'
                             }}
                             onClick={() => {
                               setSearchParams(prev => ({ ...prev, query: "" }));
                               performSearch({ ...searchParams, query: "" });
                             }}
                             title="Clear search"
                           >
                             <i className="icon-close"></i>
                           </div>
                         )}
                       </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                      <select
                          className="form-control selectpicker shadow-sm"
                        data-style="btn-white btn-lg"
                        data-width="100%"
                        data-live-search="true"
                        title="Select Region"
                        name="region"
                        value={searchParams.region}
                          onChange={handleDropdownChange}
                          style={{ borderRadius: '8px', border: 'none' }}
                          key={uniqueLocations.length} // Force re-render when locations change
                      >
                        <option value="">Anywhere</option>
                          {console.log('Rendering locations:', uniqueLocations)}
                          {uniqueLocations.map((location, index) => (
                            <option key={index} value={location}>
                              {location}
                            </option>
                          ))}
                      </select>
                       {/* Debug info - remove this later */}
                       {uniqueLocations.length > 0 && (
                         <small className="text-muted d-block mt-1">
                           Available locations: {uniqueLocations.join(', ')}
                         </small>
                       )}
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                      <select
                         className="form-control selectpicker shadow-sm"
                        data-style="btn-white btn-lg"
                        data-width="100%"
                        data-live-search="true"
                        title="Select Job Type"
                        name="jobType"
                        value={searchParams.jobType}
                         onChange={handleDropdownChange}
                         style={{ borderRadius: '8px', border: 'none' }}
                      >
                        <option value="">Any Type</option>
                        <option>Part Time</option>
                        <option>Full Time</option>
                      </select>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg btn-block text-white btn-search shadow"
                        style={{ 
                          borderRadius: '8px', 
                          background: 'linear-gradient(45deg, #007bff, #0056b3)',
                          border: 'none',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <span className="icon-search icon mr-2" />
                        Search Job
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 popular-keywords text-center">
                      <h5 className="text-white mb-3" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        Trending Keywords:
                      </h5>
                      <ul className="keywords list-unstyled m-0 p-0">
                        <li className="d-inline-block mr-3 mb-2">
                          <a href="#" className="btn btn-outline-light btn-sm" style={{ borderRadius: '20px', border: '2px solid white' }}>
                            UI Designer
                          </a>
                        </li>
                        <li className="d-inline-block mr-3 mb-2">
                          <a href="#" className="btn btn-outline-light btn-sm" style={{ borderRadius: '20px', border: '2px solid white' }}>
                            Python
                          </a>
                        </li>
                        <li className="d-inline-block mr-3 mb-2">
                          <a href="#" className="btn btn-outline-light btn-sm" style={{ borderRadius: '20px', border: '2px solid white' }}>
                            Developer
                          </a>
                        </li>
                        <li className="d-inline-block mr-3 mb-2">
                          <a href="#" className="btn btn-outline-light btn-sm" style={{ borderRadius: '20px', border: '2px solid white' }}>
                            React
                          </a>
                        </li>
                        <li className="d-inline-block mr-3 mb-2">
                          <a href="#" className="btn btn-outline-light btn-sm" style={{ borderRadius: '20px', border: '2px solid white' }}>
                            Data Science
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <a href="#next" className="scroll-button smoothscroll" style={{ 
            position: 'absolute', 
            bottom: '30px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '2rem',
            animation: 'bounce 2s infinite'
          }}>
            <span className="icon-keyboard_arrow_down" />
          </a>
        </section>

        {/* =========================
            Job Listings Section
        ========================= */}
                 <section className="site-section py-5" style={{ backgroundColor: '#e3f2fd' }}>
          <div className="container">
            <div className="row mb-5 justify-content-center">
              <div className="col-md-7 text-center">
                                 <h2 className="section-title mb-3" style={{ 
                   fontSize: '2.5rem', 
                   fontWeight: '700', 
                   color: '#1565c0',
                   position: 'relative'
                 }}>
                   Available Jobs
                   <div style={{ 
                     width: '60px', 
                     height: '4px', 
                     background: 'linear-gradient(45deg, #1976d2, #0d47a1)', 
                     margin: '20px auto 0',
                     borderRadius: '2px'
                   }}></div>
                 </h2>
                 <p className="lead" style={{ color: '#1976d2' }}>
                   Discover amazing opportunities from top companies
                   {filteredJobs.length !== jobs.length && (
                     <span className="ml-2">
                       ({filteredJobs.length} of {jobs.length} jobs found)
                     </span>
                   )}
                 </p>
                 {filteredJobs.length !== jobs.length && (
                   <button
                     onClick={handleClearSearch}
                     className="btn btn-outline-primary btn-sm"
                     style={{ 
                       borderRadius: '20px', 
                       marginTop: '10px',
                       border: '2px solid #1976d2',
                       color: '#1976d2',
                       fontWeight: '500'
                     }}
                   >
                     <i className="icon-refresh mr-1"></i>
                     Clear Search
                   </button>
                 )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <PacmanLoader
                  color="#00BD56"
                  size={30}
                  cssOverride={{ display: "block", margin: "0 auto" }}
                  loading={loading}
                />
              </div>
            ) : (
              <>
                                 <div className="row">
                  {currentJobs.map((job) => (
                     <div className="col-lg-6 mb-4" key={job.id}>
                       <div className="card h-100 shadow-sm border-0" style={{ 
                         borderRadius: '12px', 
                         transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                         cursor: 'pointer'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'translateY(-5px)';
                         e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'translateY(0)';
                         e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                       }}>
                         <div className="card-body p-4">
                           <div className="d-flex align-items-center mb-3">
                             <div className="mr-3">
                        <img
                          src={job.image || "/assets/images/job_logo_1.jpg"}
                          alt={job.jobTitle}
                                 className="rounded-circle"
                                 style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      </div>
                             <div className="flex-grow-1">
                               <h5 className="card-title mb-1" style={{ color: '#1565c0', fontWeight: '600' }}>
                                 {job.jobTitle}
                               </h5>
                               <p className="mb-0" style={{ fontSize: '0.9rem', color: '#1976d2' }}>
                                 {job.company || "Company"}
                               </p>
                             </div>
                           </div>
                           
                           <div className="row mb-3">
                             <div className="col-6">
                               <div className="d-flex align-items-center">
                                 <span className="icon-room mr-2" style={{ color: '#1976d2' }}></span>
                                 <small style={{ color: '#1976d2' }}>{job.location}</small>
                        </div>
                        </div>
                             <div className="col-6 text-right">
                                                      <span className={`badge ${job.type === "Part Time" ? "badge-warning" : "badge-success"}`}
                             style={{ 
                               padding: '8px 12px', 
                               borderRadius: '20px',
                               fontSize: '0.8rem',
                               fontWeight: '500',
                               backgroundColor: job.type === "Part Time" ? '#ffc107' : '#28a745',
                               color: job.type === "Part Time" ? '#212529' : 'white'
                             }}>
                            {job.type || "Full Time"}
                          </span>
                        </div>
                           </div>
                           
                                                        <div className="d-flex justify-content-between align-items-center">
                        <div>
                                 <small style={{ color: '#1976d2' }}>Posted recently</small>
                               </div>
                          {apply.includes(job.id) ? (
                            <span className="badge badge-success" style={{ 
                              padding: '8px 20px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              backgroundColor: '#28a745',
                              color: 'white'
                            }}>
                              Applied ✓
                            </span>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleApply(job.id)}
                              style={{ 
                                borderRadius: '20px', 
                                padding: '8px 20px',
                                background: 'linear-gradient(45deg, #007bff, #0056b3)',
                                border: 'none',
                                fontWeight: '500'
                              }}
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                       </div>
                     </div>
                  ))}
                  {currentJobs.length === 0 && (
                     <div className="col-12 text-center py-5">
                       <div className="text-muted">
                         <i className="icon-search" style={{ fontSize: '3rem', opacity: '0.3' }}></i>
                         <h5 className="mt-3">No jobs found</h5>
                         <p>Try adjusting your search criteria</p>
                       </div>
                     </div>
                   )}
                 </div>
                
                {/* Pagination - Only show if more than 5 items */}
                {jobs.length > itemsPerPage && (
                  <div className="row pagination-wrap">
                    <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
                      <span>
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, jobs.length)} of {jobs.length} Jobs
                      </span>
                    </div>
                    <div className="col-md-6 text-center text-md-right">
                      <div className="custom-pagination ml-auto">
                        <button 
                          className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                        <div className="d-inline-block">
                          {[...Array(totalPages)].map((_, idx) => (
                            <button
                              key={idx}
                              className={`${currentPage === idx + 1 ? 'active' : ''}`}
                              onClick={() => handlePageChange(idx + 1)}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>
                        <button 
                          className={`next ${currentPage === totalPages ? 'disabled' : ''}`}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* =========================
            Quick Hire Stats Section - NEW DESIGN
        ========================= */}
        <section
          className="py-5"
          id="quick-hire-stats"
          style={{ 
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
            `,
            opacity: 0.6
          }}></div>

          {/* Animated Background Elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '120px',
            height: '120px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '10%',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animation: 'pulse 6s ease-in-out infinite reverse'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '15%',
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '50%',
            animation: 'pulse 5s ease-in-out infinite'
          }}></div>

          <div className="container">
            {/* Section Header */}
            <div className="row mb-5 justify-content-center">
              <div className="col-lg-8 text-center">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '25px',
                  padding: '3rem 2rem',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #ffffff 0%, #87ceeb 50%, #ffffff 100%)',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }}></div>
                  
                  <h2 className="section-title mb-4" style={{ 
                    fontSize: '3.5rem', 
                    fontWeight: '900',
                    color: '#ffffff',
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '-1px'
                  }}>
                    Quick Hire Stats
                  </h2>
                  <p className="lead mb-0" style={{ 
                    fontSize: '1.3rem',
                    color: '#ffffff',
                    fontWeight: '500',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    opacity: '0.95'
                  }}>
                    Real-time statistics from our platform
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row justify-content-center">
              {/* Candidates Card */}
              <div className="col-lg-4 col-md-6 mb-4">
                <div className="text-center" style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '20px',
                  padding: '2.5rem 1.5rem',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)';
                }}>
                  {/* Icon Container */}
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      border: '3px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      <i className="icon-users" style={{ 
                        fontSize: '3rem', 
                        color: '#1e40af',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                      }}></i>
                    </div>
                  </div>
                  
                  {/* Number */}
                  <div className="mb-3">
                    <strong className="number" style={{ 
                      fontSize: '3.5rem', 
                      color: '#ffffff',
                      fontWeight: '900',
                      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                      display: 'block',
                      lineHeight: '1'
                    }}>
                      {usersCount}
                    </strong>
                  </div>
                  
                  {/* Label */}
                  <span className="caption" style={{ 
                    fontSize: '1.2rem',
                    color: '#ffffff',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    opacity: '0.9'
                  }}>
                    Candidates
                  </span>
                </div>
              </div>

              {/* Jobs Posted Card */}
              <div className="col-lg-4 col-md-6 mb-4">
                <div className="text-center" style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '20px',
                  padding: '2.5rem 1.5rem',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)';
                }}>
                  {/* Icon Container */}
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      border: '3px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      <i className="icon-briefcase" style={{ 
                        fontSize: '3rem', 
                        color: '#1e40af',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                      }}></i>
                    </div>
                  </div>
                  
                  {/* Number */}
                  <div className="mb-3">
                    <strong className="number" style={{ 
                      fontSize: '3.5rem', 
                      color: '#ffffff',
                      fontWeight: '900',
                      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                      display: 'block',
                      lineHeight: '1'
                    }}>
                      {jobs.length}
                    </strong>
                  </div>
                  
                  {/* Label */}
                  <span className="caption" style={{ 
                    fontSize: '1.2rem',
                    color: '#ffffff',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    opacity: '0.9'
                  }}>
                    Jobs Posted
                  </span>
                </div>
              </div>

              {/* Companies Card */}
              <div className="col-lg-4 col-md-6 mb-4">
                <div className="text-center" style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '20px',
                  padding: '2.5rem 1.5rem',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.2)';
                }}>
                  {/* Icon Container */}
                  <div className="mb-4">
                    <div style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      border: '3px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      <i className="icon-office" style={{ 
                        fontSize: '3rem', 
                        color: '#1e40af',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                      }}></i>
                    </div>
                  </div>
                  
                  {/* Number */}
                  <div className="mb-3">
                    <strong className="number" style={{ 
                      fontSize: '3.5rem', 
                      color: '#ffffff',
                      fontWeight: '900',
                      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                      display: 'block',
                      lineHeight: '1'
                    }}>
                      {companiesCount}
                    </strong>
                  </div>
                  
                  {/* Label */}
                  <span className="caption" style={{ 
                    fontSize: '1.2rem',
                    color: '#ffffff',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    opacity: '0.9'
                  }}>
                    Companies
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            Why Choose Quick Hire Section
        ========================= */}
        <section
          className="py-5"
          style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(135, 206, 235, 0.1) 0%, transparent 50%)
            `,
            opacity: 0.6
          }}></div>
          
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="row text-center mb-5">
              <div className="col-12">
                <h2 className="text-white mb-3" style={{ 
                  fontSize: '3rem', 
                  fontWeight: '800',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  Why Choose Quick Hire?
                </h2>
                <p className="text-white-50 lead" style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '500'
                }}>
                  Experience the fastest, smartest, and most reliable way to connect talent with opportunity
                </p>
              </div>
            </div>
            
            <div className="row">
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="feature-card text-center p-4" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.4s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div className="feature-icon mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 8px 25px rgba(96, 165, 250, 0.3)'
                  }}>
                    <i className="icon-bolt" style={{ 
                      fontSize: '2rem', 
                      color: 'white' 
                    }}></i>
                  </div>
                  <h4 className="text-white mb-3" style={{ fontWeight: '600' }}>
                    Lightning Fast
                  </h4>
                  <p className="text-white-50 mb-0">
                    Get matched with opportunities in minutes, not days. Our AI-powered system finds the perfect fit instantly.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="feature-card text-center p-4" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.4s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div className="feature-icon mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 8px 25px rgba(52, 211, 153, 0.3)'
                  }}>
                    <i className="icon-target" style={{ 
                      fontSize: '2rem', 
                      color: 'white' 
                    }}></i>
                  </div>
                  <h4 className="text-white mb-3" style={{ fontWeight: '600' }}>
                    Smart Matching
                  </h4>
                  <p className="text-white-50 mb-0">
                    Advanced algorithms ensure you're connected with roles that match your skills, experience, and career goals.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="feature-card text-center p-4" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.4s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div className="feature-icon mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
                  }}>
                    <i className="icon-shield" style={{ 
                      fontSize: '2rem', 
                      color: 'white' 
                    }}></i>
                  </div>
                  <h4 className="text-white mb-3" style={{ fontWeight: '600' }}>
                    Trusted & Secure
                  </h4>
                  <p className="text-white-50 mb-0">
                    Your data is protected with enterprise-grade security. We've helped thousands find their dream jobs safely.
                  </p>
                </div>
              </div>
              
              <div className="col-lg-3 col-md-6 mb-4">
                <div className="feature-card text-center p-4" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.4s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div className="feature-icon mb-3" style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
                  }}>
                    <i className="icon-users" style={{ 
                      fontSize: '2rem', 
                      color: 'white' 
                    }}></i>
                  </div>
                  <h4 className="text-white mb-3" style={{ fontWeight: '600' }}>
                    24/7 Support
                  </h4>
                  <p className="text-white-50 mb-0">
                    Our dedicated team is here to help you succeed. Get support whenever you need it, day or night.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="row mt-5">
              <div className="col-12 text-center">
                <Link to="/jobs" className="btn btn-light btn-lg px-5 py-3" style={{
                  borderRadius: '30px',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}>
                  <i className="icon-search mr-2"></i>
                  Explore Jobs Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            Companies Helped Section
        ========================= */}
         <section className="site-section py-5" style={{ 
           background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
           position: 'relative',
           overflow: 'hidden'
         }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
            `,
            opacity: 0.6
          }}></div>
          
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 text-center mt-4 mb-5">
                <div className="row justify-content-center">
                  <div className="col-md-8">
                     <h2 className="section-title mb-3" style={{ 
                       fontSize: '3rem', 
                       fontWeight: '800', 
                       background: 'linear-gradient(135deg, #1e3c72 0%, #2563eb 100%)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       backgroundClip: 'text',
                       textShadow: 'none'
                     }}>
                       Companies We've Helped
                     </h2>
                     <p className="lead" style={{ 
                       color: '#374151',
                       fontSize: '1.2rem',
                       fontWeight: '500'
                     }}>
                       Trusted by leading companies worldwide to find their perfect talent
                    </p>
                  </div>
                </div>
              </div>
               <div className="col-12">
                 <div className="row justify-content-center align-items-center">
                   <div className="col-6 col-lg-3 col-md-4 text-center mb-4">
                     <div className="company-logo-container" style={{ 
                       padding: '25px', 
                       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                       transition: 'all 0.4s ease',
                       border: '1px solid rgba(37, 99, 235, 0.1)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.3)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.1)';
                     }}>
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         height: '3px',
                         background: 'linear-gradient(135deg, #87ceeb 0%, #2563eb 100%)',
                         transform: 'scaleX(0)',
                         transition: 'transform 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'scaleX(1)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'scaleX(0)';
                       }}></div>
                <img
                  src="/assets/images/logo_mailchimp.svg"
                         alt="Mailchimp"
                         className="img-fluid"
                         style={{ 
                           maxHeight: '60px', 
                           filter: 'brightness(0.8)',
                           transition: 'all 0.3s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.filter = 'brightness(1) scale(1.1)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.filter = 'brightness(0.8) scale(1)';
                         }}
                />
              </div>
                   </div>
                   <div className="col-6 col-lg-3 col-md-4 text-center mb-4">
                     <div className="company-logo-container" style={{ 
                       padding: '25px', 
                       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                       transition: 'all 0.4s ease',
                       border: '1px solid rgba(37, 99, 235, 0.1)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.3)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.1)';
                     }}>
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         height: '3px',
                         background: 'linear-gradient(135deg, #87ceeb 0%, #2563eb 100%)',
                         transform: 'scaleX(0)',
                         transition: 'transform 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'scaleX(1)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'scaleX(0)';
                       }}></div>
                <img
                  src="/assets/images/logo_paypal.svg"
                         alt="PayPal"
                         className="img-fluid"
                         style={{ 
                           maxHeight: '60px', 
                           filter: 'brightness(0.8)',
                           transition: 'all 0.3s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.filter = 'brightness(1) scale(1.1)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.filter = 'brightness(0.8) scale(1)';
                         }}
                />
              </div>
                   </div>
                   <div className="col-6 col-lg-3 col-md-4 text-center mb-4">
                     <div className="company-logo-container" style={{ 
                       padding: '25px', 
                       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                       transition: 'all 0.4s ease',
                       border: '1px solid rgba(37, 99, 235, 0.1)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.3)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.1)';
                     }}>
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         height: '3px',
                         background: 'linear-gradient(135deg, #87ceeb 0%, #2563eb 100%)',
                         transform: 'scaleX(0)',
                         transition: 'transform 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'scaleX(1)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'scaleX(0)';
                       }}></div>
                <img
                  src="/assets/images/logo_stripe.svg"
                         alt="Stripe"
                         className="img-fluid"
                         style={{ 
                           maxHeight: '60px', 
                           filter: 'brightness(0.8)',
                           transition: 'all 0.3s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.filter = 'brightness(1) scale(1.1)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.filter = 'brightness(0.8) scale(1)';
                         }}
                />
              </div>
                   </div>
                   <div className="col-6 col-lg-3 col-md-4 text-center mb-4">
                     <div className="company-logo-container" style={{ 
                       padding: '25px', 
                       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                       transition: 'all 0.4s ease',
                       border: '1px solid rgba(37, 99, 235, 0.1)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.3)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.1)';
                     }}>
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         height: '3px',
                         background: 'linear-gradient(135deg, #87ceeb 0%, #2563eb 100%)',
                         transform: 'scaleX(0)',
                         transition: 'transform 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'scaleX(1)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'scaleX(0)';
                       }}></div>
                <img
                  src="/assets/images/logo_visa.svg"
                         alt="Visa"
                         className="img-fluid"
                         style={{ 
                           maxHeight: '60px', 
                           filter: 'brightness(0.8)',
                           transition: 'all 0.3s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.filter = 'brightness(1) scale(1.1)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.filter = 'brightness(0.8) scale(1)';
                         }}
                />
              </div>
                   </div>
                   <div className="col-6 col-lg-3 col-md-4 text-center mb-4">
                     <div className="company-logo-container" style={{ 
                       padding: '25px', 
                       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                       transition: 'all 0.4s ease',
                       border: '1px solid rgba(37, 99, 235, 0.1)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.3)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.1)';
                     }}>
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         height: '3px',
                         background: 'linear-gradient(135deg, #87ceeb 0%, #2563eb 100%)',
                         transform: 'scaleX(0)',
                         transition: 'transform 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'scaleX(1)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'scaleX(0)';
                       }}></div>
                <img
                  src="/assets/images/logo_apple.svg"
                         alt="Apple"
                         className="img-fluid"
                         style={{ 
                           maxHeight: '60px', 
                           filter: 'brightness(0.8)',
                           transition: 'all 0.3s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.filter = 'brightness(1) scale(1.1)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.filter = 'brightness(0.8) scale(1)';
                         }}
                />
              </div>
                   </div>
                   <div className="col-6 col-lg-3 col-md-4 text-center mb-4">
                     <div className="company-logo-container" style={{ 
                       padding: '25px', 
                       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                       transition: 'all 0.4s ease',
                       border: '1px solid rgba(37, 99, 235, 0.1)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.3)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.1)';
                     }}>
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         height: '3px',
                         background: 'linear-gradient(135deg, #87ceeb 0%, #2563eb 100%)',
                         transform: 'scaleX(0)',
                         transition: 'transform 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'scaleX(1)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'scaleX(0)';
                       }}></div>
                <img
                  src="/assets/images/logo_tinder.svg"
                         alt="Tinder"
                         className="img-fluid"
                         style={{ 
                           maxHeight: '60px', 
                           filter: 'brightness(0.8)',
                           transition: 'all 0.3s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.filter = 'brightness(1) scale(1.1)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.filter = 'brightness(0.8) scale(1)';
                         }}
                />
              </div>
                   </div>
                   <div className="col-6 col-lg-3 col-md-4 text-center mb-4">
                     <div className="company-logo-container" style={{ 
                       padding: '25px', 
                       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                       transition: 'all 0.4s ease',
                       border: '1px solid rgba(37, 99, 235, 0.1)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.3)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.1)';
                     }}>
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         height: '3px',
                         background: 'linear-gradient(135deg, #87ceeb 0%, #2563eb 100%)',
                         transform: 'scaleX(0)',
                         transition: 'transform 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'scaleX(1)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'scaleX(0)';
                       }}></div>
                <img
                  src="/assets/images/logo_sony.svg"
                         alt="Sony"
                         className="img-fluid"
                         style={{ 
                           maxHeight: '60px', 
                           filter: 'brightness(0.8)',
                           transition: 'all 0.3s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.filter = 'brightness(1) scale(1.1)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.filter = 'brightness(0.8) scale(1)';
                         }}
                />
              </div>
                   </div>
                   <div className="col-6 col-lg-3 col-md-4 text-center mb-4">
                     <div className="company-logo-container" style={{ 
                       padding: '25px', 
                       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                       transition: 'all 0.4s ease',
                       border: '1px solid rgba(37, 99, 235, 0.1)',
                       position: 'relative',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.3)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                       e.currentTarget.style.border = '1px solid rgba(37, 99, 235, 0.1)';
                     }}>
                       <div style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         height: '3px',
                         background: 'linear-gradient(135deg, #87ceeb 0%, #2563eb 100%)',
                         transform: 'scaleX(0)',
                         transition: 'transform 0.3s ease'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'scaleX(1)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'scaleX(0)';
                       }}></div>
                <img
                  src="/assets/images/logo_airbnb.svg"
                         alt="Airbnb"
                         className="img-fluid"
                         style={{ 
                           maxHeight: '60px', 
                           filter: 'brightness(0.8)',
                           transition: 'all 0.3s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.filter = 'brightness(1) scale(1.1)';
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.filter = 'brightness(0.8) scale(1)';
                         }}
                />
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            Testimonials Section
        ========================= */}
        <section className="bg-light pt-5 testimony-full">
          <div className="owl-carousel single-carousel">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 align-self-center text-center text-lg-left">
                  <blockquote>
                    <p>
                      “Soluta quasi cum delectus eum facilis recusandae nesciunt
                      molestias accusantium libero dolores repellat id in dolorem
                      laborum ad modi qui at quas dolorum voluptatem voluptatum
                      repudiandae.”
                    </p>
                    <p>
                      <cite> — Corey Woods, @Dribbble</cite>
                    </p>
                  </blockquote>
                </div>
                <div className="col-lg-6 align-self-end text-center text-lg-right">
                  <img
                    src="/assets/images/person_transparent_2.png"
                    alt="Image"
                    className="img-fluid mb-0"
                  />
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-lg-6 align-self-center text-center text-lg-left">
                  <blockquote>
                    <p>
                      “Soluta quasi cum delectus eum facilis recusandae nesciunt
                      molestias accusantium libero dolores repellat id in dolorem
                      laborum ad modi qui at quas dolorum voluptatem voluptatum
                      repudiandae.”
                    </p>
                    <p>
                      <cite> — Chris Peters, @Google</cite>
                    </p>
                  </blockquote>
                </div>
                <div className="col-lg-6 align-self-end text-center text-lg-right">
                  <img
                    src="/assets/images/person_transparent.png"
                    alt="Image"
                    className="img-fluid mb-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
  } catch (renderError) {
    console.error('Error rendering Home component:', renderError);
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>Error Rendering Page</h1>
        <p>{renderError.message}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
}