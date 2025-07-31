import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../Firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [apply,setApply]=useState("")
  const userId=sessionStorage.getItem("userId")
    const navigate = useNavigate();
  useEffect(() => {
    // Jobs
    const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
      setJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      
    });

    onSnapshot(query(collection(db,"applications"),where("userId","==",userId)),(snapshot)=>{
      setApply(snapshot.docs.map((doc)=>{
        return {id:doc.id, ...doc.data()}
        // console.log(doc.data());
        
      })
    )

    })
  },[]);
     
   const handleApply = (jobId) => {
    const isLogin = sessionStorage.getItem("isLogin");
    if (!isLogin) {
      navigate("/login");
    } else {
      navigate(`/ApplyJobs/${jobId}`);
    }
  };

  return (
    <>
      <section
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: "url(/assets/images/hero_1.jpg)" }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Jobs</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>Jobs</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="site-section">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div className="col-md-7 text-center">
              <h2 className="section-title mb-2">Available Jobs</h2>
            </div>
          </div>
          <ul className="job-listings mb-5">
            {jobs.map((job) => (
              <li
                className="job-listing d-block d-sm-flex pb-3 pb-sm-0 align-items-center"
                key={job.id}
              >
                <div className="job-listing-logo">
                  <img
                    src={job.image || "/assets/images/job_logo_1.jpg"}
                    alt={job.jobTitle}
                    className="img-fluid"
                  />
                </div>
                <div className="job-listing-about d-sm-flex custom-width w-100 justify-content-between mx-4">
                  <div className="job-listing-position custom-width w-50 mb-3 mb-sm-0">
                    <h2>{job.jobTitle}</h2>
                    <strong>{job.company || "Company"}</strong>
                  </div>
                  <div className="job-listing-location mb-3 mb-sm-0 custom-width w-25">
                    <span className="icon-room" /> {job.location}
                  </div>
                  <div className="job-listing-meta">
                    <span
                      className={`badge ${
                        job.type === "Part Time"
                          ? "badge-danger"
                          : "badge-success"
                      }`}
                    >
                      {job.type || "Full Time"}
                    </span>
                  </div>
                  <div>
                   {
                    apply.map((el,index)=>{
                      if(el.jobId!=job.id){
                        return <button key={index}
                      className="btn btn-primary btn-sm ml-2"
                      onClick={() => handleApply(job.id)}
                    >
                      Apply
                    </button>
                      }
                    })
                   }
                  </div>
                </div>
              </li>
            ))}
            {jobs.length === 0 && (
              <li className="text-center text-muted">No jobs found.</li>
            )}
          </ul>
          <div className="row pagination-wrap">
            <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
              <span>Showing 1-7 Of 43,167 Jobs</span>
            </div>
            <div className="col-md-6 text-center text-md-right">
              <div className="custom-pagination ml-auto">
                <a href="#" className="prev">
                  Prev
                </a>
                <div className="d-inline-block">
                  <a href="#" className="active">
                    1
                  </a>
                  <a href="#">2</a>
                  <a href="#">3</a>
                  <a href="#">4</a>
                </div>
                <a href="#" className="next">
                  Next
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
