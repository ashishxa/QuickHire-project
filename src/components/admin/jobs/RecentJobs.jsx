import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { format } from "date-fns";

export default function RecentJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "jobs"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <>
      <section
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: 'url("/assets/images/hero_1.jpg")' }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Recent Jobs</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>Recent Jobs</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="table-responsive" style={{ boxShadow: "0px 0px 15px gray" }}>
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Posted On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No jobs found</td>
                </tr>
              ) : (
                jobs.map((job, index) => (
                  <tr key={job.id}>
                    <td>{index + 1}</td>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.createdAt ? format(job.createdAt.toDate(), "dd MMM yyyy") : "N/A"}</td>
                    <td>
                      <span className={`badge ${job.status === "Open" ? "bg-success" : "bg-secondary"}`}>
                        {job.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
