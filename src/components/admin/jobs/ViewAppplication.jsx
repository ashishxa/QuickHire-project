import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { PacmanLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function ViewApplication() {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState({});
  const [companies, setCompanies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users
    onSnapshot(collection(db, "users"), (snapshot) => {
      const data = {};
      snapshot.docs.forEach((doc) => {
        data[doc.id] = doc.data().name;
      });
      setUsers(data);
    });

    // Fetch companies
    onSnapshot(collection(db, "companies"), (snapshot) => {
      const data = {};
      snapshot.docs.forEach((doc) => {
        data[doc.id] = doc.data().name;
      });
      setCompanies(data);
    });

    // Fetch applications
    onSnapshot(collection(db, "applications"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setApplications(data);
      setLoading(false);
    });
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
              <h1 className="text-white font-weight-bold">View Applications</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Applications</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        {loading ? (
          <PacmanLoader
            color="#00BD56"
            size={30}
            cssOverride={{ display: "block", margin: "0 auto" }}
            loading={loading}
          />
        ) : (
          <div className="row justify-content-center">
            <div className="col-md-12" style={{ boxShadow: "0px 0px 15px gray" }}>
              <div className="contact-wrap w-100 p-md-5 p-4">
                <h3 className="mb-4">All Applications</h3>
                <table className="table table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr. No.</th>
                      <th>User</th>
                      <th>Company</th>
                      <th>Resume</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, index) => (
                      <tr key={app.id}>
                        <td>{index + 1}</td>
                        <td>{users[app.userId] || "Unknown User"}</td>
                        <td>{companies[app.companyId] || "Unknown Company"}</td>
                        <td>
                          {app.resume ? (
                            <a href={app.resume} target="_blank" rel="noreferrer">
                              View Resume
                            </a>
                          ) : (
                            <span className="text-danger">No Resume</span>
                          )}
                        </td>
                        <td>{app.status || "Pending"}</td>
                        <td>
                          <Link
                            to={`/admin/applications/${app.id}`}
                            className="btn btn-sm btn-info"
                          >
                            View Details
                          </Link>
                        </td>
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
