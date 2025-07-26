import { deleteDoc, doc, collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // Link is required for "Add New +" button

export default function ManageJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [load, setLoad] = useState(true);

  // ✅ Fetch jobs in real-time from Firebase
  const fetchData = () => {
    const q = query(collection(db, "jobs"));
    onSnapshot(q, (jobData) => {
      setAllJobs(
        jobData.docs.map((el) => {
          return { id: el.id, ...el.data() };
        })
      );
      setLoad(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Delete job with confirmation alert
  const DeleteJobs = (jobId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "jobs", jobId))
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your job has been deleted.",
              icon: "success",
            });
          })
          .catch((error) => {
            toast.error("Delete failed: " + error.message);
          });
      }
    });
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
            <div className="col-md-12">
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
        <div className="row justify-content-center">
          <div className="col-md-12" style={{ boxShadow: "0 0 15px gray" }}>
            <div className="d-flex justify-content-end p-2">
              <Link to="/company/addjobs" className="btn btn-outline-primary">
                Add New +
              </Link>
            </div>
            <div className="contact-wrap w-100 p-md-5 p-4">
              <h3 className="mb-4">All Job Posts</h3>

              {/* ✅ Responsive Table */}
              <div className="table-responsive">
                <table className="table table-bordered table-striped text-center">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Vacancy</th>
                      <th>Location</th>
                      <th>Skills</th>
                      <th>Experience</th>
                      <th>Salary</th>
                      <th>Description</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allJobs.map((job, index) => (
                      <tr key={job.id}>
                        <td>{index + 1}</td>
                        <td>{job.jobTitle || "N/A"}</td>
                        <td>{job.vacancy || "N/A"}</td>
                        <td>{job.location || "N/A"}</td>
                        <td>{job.skills || "N/A"}</td>
                        <td>{job.experience || "N/A"}</td>
                        <td>{job.salary || "N/A"}</td>
                        <td>{job.description || "N/A"}</td>
                        <td>
                          {job.image ? (
                            <img
                              src={job.image}
                              alt="Job"
                              style={{ width: "60px", height: "60px", objectFit: "cover" }}
                              className="rounded"
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => DeleteJobs(job.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {allJobs.length === 0 && (
                      <tr>
                        <td colSpan="10" className="text-muted">
                          No jobs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* End table */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
