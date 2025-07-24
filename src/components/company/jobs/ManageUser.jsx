import { collection, onSnapshot, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { PacmanLoader } from "react-spinners"
import { db } from "../../../Firebase"

export default function ManageUsers(){
    const [load, setLoad]=useState(false)
    const [users, setUsers]=useState([])
    // useEffect(fn, [dependency])
    useEffect(()=>{
        fetchData()
    },[])

    const fetchData=()=>{
        //getDoc, onsnapshot, getdocs
        let q = query(collection(db, "users"))
        onSnapshot(q,(userCol)=>{
            setUsers(userCol.docs.map((el)=>{
                // console.log(el.data(), el.id);
                return {id:el.id, ...el.data()};
            }))
        })
    }
    return(
        <>
      <section
    className="section-hero overlay inner-page bg-image"
    style={{ backgroundImage: 'url(/assets/images/hero_1.jpg)' }}
    id="home-section"
  >
    <div className="container">
      <div className="row">
        <div className="col-md-7">
          <h1 className="text-white font-weight-bold">Manage User</h1>
          <div className="custom-breadcrumbs">
            <a href="index.html">Home</a> <span className="mx-2 slash">/</span>
            <span className="text-white">
              <strong>Manage User</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
            <div className="container my-5">
            {
            load?
            <PacmanLoader color="#00BD56" size={30} cssOverride={{display:"block", margin:"0 auto"}} loading={load}/>
           
              :
              <div className="row justify-content-center no-gutters">
                <div className="col-md" style={{boxShadow:"0px 0px 15px gray"}}>
                  <div className="contact-wrap table-responsive w-100 p-md-5 p-4">
                    <h3 className="mb-4">Manage Users</h3>
                    <table className="table table-bordered table-hover table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>Sno</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((el, index)=>{
                                return(
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{el?.name}</td>
                                        <td>{el?.email}</td>
                                        <td>{el?.contact}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                  </div>
                </div>
              
              </div>
            }
            </div>
        </>
    )
}


