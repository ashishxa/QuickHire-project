import {
  deleteDoc,
  doc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { toast } from "react-toastify";

export default function ManageJobs() {
  const [allJobs, setAllJobs] = useState([]);

  const fetchData = () => {
    const q = query(collection(db, "jobs"), where("type", "==", "Seeker")); // change collection to 'jobs', filter by type=Seeker
    onSnapshot(q, (snapshot) => {
      setAllJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteJob = async (jobId) => {
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error(error.message);
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
              <h1 className="text-white font-weight-bold">Manage Jobs</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>Manage Jobs</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row justify-content-center no-gutters">
          <div className="col-md-12 " style={{ boxShadow: "0 0 15px gray" }}>
            <div className="contact-wrap w-100 p-md-5 p-4">
              <h3 className="mb-4">Job Seekers List</h3>
              <table className="table table-striped text-center">
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th>Job Name</th>
                    <th>Skills</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Vacancy</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {allJobs.map((job, index) => (
                    <tr key={job.id}>
                      <th>{index + 1}</th>
                      <td>{job.breedName || "N/A"}</td>
                      <td>{job.type || "N/A"}</td>
                      <td>{job.description || "N/A"}</td>
                      <td>
                        {job.image ? (
                          <img
                            src={job.image}
                            alt="Job"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                            className="rounded"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteJob(job.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {allJobs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-muted">
                        No job seekers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
