import { addDoc, collection, deleteDoc, doc, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

export default function Managejobs() {
  const [load, setLoad] = useState(true);
  const [AllJobs, setAllJobs] = useState([]);

  const fetchData=()=>{
          const q=query(collection(db,"jobs")
          // ,where("type","==","Dog")
      ) 
          onSnapshot(q,(breedData)=>{
              setAllJobs(
                  jobData.docs.map((el)=>{
                  // console.log(el.id,el.data());
                  return{id:el.id,...el.data()}
              }))
              setLoad(false)
          })
      }
  
      useEffect(()=>{
          fetchData()
      },[])

  const DeleteJob= (JobId)=>{
         
          Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
          }).then(async (result) => {
          if (result.isConfirmed) {
              await deleteDoc(doc(db,"jobs",JobId))
              .then(()=>{
                  Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success"
                  });
  
              }).catch((error)=>{
                  toast.error(error.message)
              })
             
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
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Job</th>
                      <th scope="col">Vac</th>
                      <th scope="col">Loc</th>
                      <th scope="col">Skills</th>
                      <th scope="col">Des</th>
                      <th scope="col">Salary</th>
                      <th scope="col">Qualification</th>
                      <th scope="col">Experience</th>
                      <th scope="col">Image</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AllJobs.map((el, index) => (
                      <tr key={el.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{el.jobtTitle}</td>
                        <td>{el.vacancy}</td>
                        <td>{el.location}</td>
                        <td>{el.skills}</td>
                        <td>{el.description}</td>
                        <td>{el.salary}</td>
                        <td>{el.qualification}</td>
                        <td>{el.experience}</td>
                        <td>
                          {el.image ? (
                            <img
                              src={el.image}
                              alt="job"
                              className="img-fluid"
                              style={{ height: "50px", width: "50px" }}
                            />
                          ) : (
                            <span className="text-danger">No image</span>
                          )}
                        </td>
                        <td>
                          <Link to={`/company/jobs/edit/${el.id}`} className="btn btn-outline-success mx-2">
                            Edit
                          </Link>
                          <button className="btn btn-danger" onClick={() => DeleteJob(el.id)}>
                            Delete
                          </button>
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
