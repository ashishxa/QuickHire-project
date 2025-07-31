import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import { db } from "../../../Firebase";
import Switch from "react-switch";
import Swal from "sweetalert2";

export default function AManageUser() {
  const [load, setLoad] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    let q = query(collection(db, "users"),where("userType","==",3)
  );
    onSnapshot(q, (userCol) => {
      setUsers(
        userCol.docs.map((el) => {
          return { id: el.id, ...el.data() };
        })
      );
    });
  };

  const changeStatus = (userId, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${status ? "block" : "un-block"}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        let data = {
          status: !status,
        };
        await updateDoc(doc(db, "users", userId), data)
          .then(() => {
            Swal.fire({
              title: `${status ? "Blocked" : "Un-blocked"}`,
              icon: "success",
            });
          })
          .catch((error) => {
            toast.error(error.message);
          });
      }
    });
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

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
              <h1 className="text-white font-weight-bold">Manage User</h1>
              <div className="custom-breadcrumbs">
                <a href="#">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>Manage User</strong>
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
            loading={load}
          />
        ) : (
          <div className="row justify-content-center no-gutters">
            <div className="col-md" style={{ boxShadow: "0px 0px 15px gray" }}>
              <div className="contact-wrap table-responsive w-100 p-md-5 p-4">
                <h3 className="mb-4">Manage Users</h3>
                <table className="table table-bordered table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sno</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((el, index) => (
                      <tr key={el.id}>
                        <td>{indexOfFirstUser + index + 1}</td>
                        <td>{el?.name}</td>
                        <td>{el?.email}</td>
                        <td>{el?.contact}</td>
                        <td>{el?.status ? "Active" : "In-active"}</td>
                        <td>
                          <Switch
                            checked={el?.status}
                            onChange={() => {
                              changeStatus(el?.id, el?.status);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    {currentUsers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-muted text-center">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      {[...Array(totalPages)].map((_, idx) => (
                        <li
                          key={idx}
                          className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(idx + 1)}
                          >
                            {idx + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
                {/* End pagination */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
