import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import Swal from "sweetalert2";
import { PacmanLoader } from "react-spinners";
import Switch from "react-switch";

export default function AManageCompany() {
  const [companies, setCompanies] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {
    setLoad(true);
    const q = query(collection(db, "users"), where("userType", "==", 2));
    onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompanies(list);
      setLoad(false);
    });
  };

  const toggleStatus = (companyId, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${status ? "block" : "unblock"} this company?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status ? "Block" : "Unblock"}`,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateDoc(doc(db, "users", companyId), {
          status: !status,
        });

        Swal.fire(
          `${status ? "Blocked" : "Unblocked"}!`,
          "Company status updated.",
          "success"
        );
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
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Manage Companies</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>Manage Companies</strong>
                </span>
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
          />
        ) : (
          <div className="row justify-content-center no-gutters">
            <div className="col-md" style={{ boxShadow: "0px 0px 15px gray" }}>
              <div className="contact-wrap table-responsive w-100 p-md-5 p-4">
                <h3 className="mb-4">All Registered Companies</h3>
                <table className="table table-bordered table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sno</th>
                      <th>Company Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Location</th> {/* New */}
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((el, index) => (
                      <tr key={el.id}>
                        <td>{index + 1}</td>
                        <td>{el.name}</td>
                        <td>{el.email}</td>
                        <td>{el.contact}</td>
                        <td>{el.location || "N/A"}</td> {/* New */}
                        <td>{el.status ? "Active" : "Inactive"}</td>
                        <td>
                          <Switch
                            checked={el.status}
                            onChange={() => toggleStatus(el.id, el.status)}
                          />
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
