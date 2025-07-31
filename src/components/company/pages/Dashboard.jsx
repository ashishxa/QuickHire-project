import { useEffect } from "react"
import { useState } from "react";
import { db } from "../../../Firebase";
import { onSnapshot } from "firebase/firestore";
import { collection } from "firebase/firestore";
export default function Dashboard(){
  const [usersCount,setUsersCount]=useState("")
  const [jobs, setJobs] = useState([]);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [jobsFilledCount, setJobsFilledCount] = useState(0);
  useEffect(() =>{
     // Companies
        const unsubCompanies = onSnapshot(collection(db, "companies"), (snapshot) => {
          setCompaniesCount(snapshot.size);
        });
     // Jobs
        const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
          setJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setJobsFilledCount(snapshot.docs.filter(doc => doc.data().status === "filled").length);
        });
 
        const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
          setUsersCount(snapshot.size);
        });

  }
  )
    return(
        <>
       <div className="site-wrap">
      
     <section
    className="section-hero overlay inner-page bg-image"
    style={{ backgroundImage: 'url(/assets/images/hero_1.jpg)' }}
    id="home-section"
  >
    <div className="container">
      <div className="row">
        <div className="col-md-7">
          <h1 className="text-white font-weight-bold">Dashboard</h1>
          <div className="custom-breadcrumbs">
            <a href="#">Home</a> <span className="mx-2 slash">/</span>
            <span className="text-white">
              <strong>Dashboard</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section
  className="site-section services-section bg-light block__62849"
  id="next-section"
>
  <div className="container">
    <div className="row">
      <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5">
        <a
          href="service-single.html"
          className="block__16443 text-center d-block"
        >
          <span className="custom-icon mx-auto">
            <span className="icon-magnet d-block" />
          </span>
          <h3>Total Jobs</h3>
          <p>
            10
          </p>
        </a>
      </div>
      <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5">
        <a
          href="service-single.html"
          className="block__16443 text-center d-block"
        >
          <span className="custom-icon mx-auto">
            <span className="icon-trophy d-block" />
          </span>
          <h3>Application</h3>
          <p>
           15
          </p>
        </a>
      </div>
      <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5">
        <a
          href="service-single.html"
          className="block__16443 text-center d-block"
        >
          <span className="custom-icon mx-auto">
            <span className="icon-laptop d-block" />
          </span>
          <h3>Status</h3>
          <p>
            
          </p>
        </a>
      </div>
      <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5">
        <a
          href="service-single.html"
          className="block__16443 text-center d-block"
        >
          <span className="custom-icon mx-auto">
            <span className="icon-search d-block" />
          </span>
          <h3>Search</h3>
          <p>
           
          </p>
        </a>
      </div>
      <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5">
        <a
          href="service-single.html"
          className="block__16443 text-center d-block"
        >
          <span className="custom-icon mx-auto">
            <span className="icon-paper-plane d-block" />
          </span>
          <h3>Help us </h3>
          <p>
          
          </p>
        </a>
      </div>
      <div className="col-6 col-md-6 col-lg-4 mb-4 mb-lg-5">
        <a
          href="service-single.html"
          className="block__16443 text-center d-block"
        >
          <span className="custom-icon mx-auto">
            <span className="icon-plug d-block" />
          </span>
          <h3>Contact</h3>
          <p className="d-sm-block">
           
          </p>
        </a>
      </div>
    </div>
  </div>
</section>

       
      </div>
        </>
    )
}