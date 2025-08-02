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
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .dashboard-hero {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            padding: 80px 0 60px;
            position: relative;
            overflow: hidden;
          }
          
          .dashboard-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.3;
          }
          
          .content-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(37, 99, 235, 0.1);
            margin-bottom: 2rem;
            transition: all 0.4s ease;
          }
          
          .content-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(37, 99, 235, 0.15);
          }
          
          .content-card h3 {
            color: #1e293b;
            font-weight: 700;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .content-card h3::before {
            content: '';
            width: 4px;
            height: 20px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            border-radius: 2px;
          }
          
          .table {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          }
          
          .table thead th {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            border: none;
            padding: 1rem;
            font-weight: 600;
          }
          
          .table tbody td {
            padding: 1rem;
            border-bottom: 1px solid rgba(37, 99, 235, 0.1);
            vertical-align: middle;
          }
          
          .table tbody tr:hover {
            background: rgba(59, 130, 246, 0.05);
          }
          
          .pagination .page-item.active .page-link {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            border-color: #3b82f6;
          }
          
          .pagination .page-link {
            color: #3b82f6;
          }
        `}
      </style>

      <section className="dashboard-hero">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Manage User</h1>
              <div className="custom-breadcrumbs">
                <Link to="/admin">Home</Link> <span className="mx-2 slash">/</span>
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
            color="#3b82f6"
            size={30}
            cssOverride={{ display: "block", margin: "0 auto" }}
            loading={load}
          />
        ) : (
          <div className="row justify-content-center no-gutters">
            <div className="col-md">
              <div className="content-card table-responsive">
                <h3 className="mb-4">Manage Users</h3>
                <table className="table table-hover">
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
