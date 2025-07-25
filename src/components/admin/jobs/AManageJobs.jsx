import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { PacmanLoader } from "react-spinners";

export default function AManagejobs() {
  const [load, setLoad] = useState(true);
  const [AllJobs, setAllJobs] = useState([]);
  const [applicationsMap, setApplicationsMap] = useState({});

  const fetchData = () => {
    const jobQuery = query(collection(db, "jobs"));
    const appQuery = query(collection(db, "applications"));

    onSnapshot(jobQuery, (jobData) => {
      const jobs = jobData.docs.map((el) => ({
        id: el.id,
        ...el.data(),
      }));
      setAllJobs(jobs);
      setLoad(false);
    });

    onSnapshot(appQuery, (appData) => {
      const appCounts = {};
      appData.docs.forEach((doc) => {
        const data = doc.data();
        const jobId = data.jobId;
        if (jobId) {
          appCounts[jobId] = (appCounts[jobId] || 0) + 1;
        }
      });
      setApplicationsMap(appCounts);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              <h1 className="text-white font-weight-bold">Manage Jobs</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Manage Jobs</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        {load ? (
          <PacmanLoader
            color="#00BD56"
            size={30}
            cssOverride={{ display: "block", margin: "0 auto" }}
            loading={load}
          />
        ) : (
          <div className="row justify-content-center no-gutters">
            <div className="col-md-12" style={{ boxShadow: "0px 0px 15px gray" }}>
              <div className="contact-wrap w-100 p-md-5 p-4">
                <h3 className="mb-4">Manage Jobs</h3>
                <table className="table table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Job</th>
                      <th>Vacancy</th>
                      <th>Location</th>
                      <th>Salary</th>
                      <th>Skills</th>
                      <th>Applications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AllJobs.map((el, index) => (
                      <tr key={el.id}>
                        <td>{index + 1}</td>
                        <td>{el.jobtTitle}</td>
                        <td>{el.vacancy}</td>
                        <td>{el.location}</td>
                        <td>{el.salary}</td>
                        <td>{el.skills}</td>
                        <td>{applicationsMap[el.id] || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
