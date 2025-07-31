import { createUserWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { auth, db } from "../../Firebase"
import { toast } from "react-toastify"
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { useNavigate, useLocation, Link } from "react-router-dom"

export default function Register(){
  const [name, setName]=useState("")
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [contact, setContact]=useState("")
  const nav=useNavigate()
  const location = useLocation();

  // Get userType from query string, default to 3
  const queryParams = new URLSearchParams(location.search);
  const userTypeFromQuery = parseInt(queryParams.get("userType"), 10);
  const isEmployer = userTypeFromQuery === 2;
  const userType = isEmployer ? 2 : 3;

  const handleForm=(e)=>{
    e.preventDefault()
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCred)=>{
      let userId=userCred.user.uid
      saveData(userId)
    })
    .catch((err)=>{
      toast.error(err.message)
    })
  }

  const saveData=async (userId)=>{
    try{
      let data={
        name:name, 
        email:email,
        contact:contact,
        userId:userId,
        userType: userType, 
        status:true, 
        createdAt:Timestamp.now()
      }
     
      await setDoc(doc(db, "users",userId),data)
      toast.success("Register successfully!!")
      getUserData(userId)
    }
    catch(err){
      toast.error(err.message)
    }
  }
    const getUserData=async (userId)=>{
     let userDoc=await getDoc(doc(db,"users", userId))
     let userData=userDoc.data()
     sessionStorage.setItem("name", userData?.name)
     sessionStorage.setItem("email", userData?.email)
     sessionStorage.setItem("userType", userData?.userType)
     sessionStorage.setItem("userId", userId)
     sessionStorage.setItem("isLogin", true)
     toast.success("Login successfully")
     if(userData?.userType==1){
      nav("/admin")
     }else if(userData?.userType==2){
      nav("/company")
     }else{
      nav("/")
     }
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
          <h1 className="text-white font-weight-bold">{isEmployer ? "Employer Registration" : "Job Seeker Registration"}</h1>
          <div className="custom-breadcrumbs">
            <a href="/">Home</a> <span className="mx-2 slash">/</span>
            <span className="text-white">
              <strong>{isEmployer ? "Employer Registration" : "Job Seeker Registration"}</strong>
            </span>
          </div>
          {isEmployer && (
            <div className="alert alert-info mt-3">
              <strong>You are registering as an Employer</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
            <div className="container my-5">
                
                {/* contact form  */}
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="contact-wrap p-md-5 p-4 shadow rounded bg-white">
                  <h3 className="mb-4 text-center">{isEmployer ? "Register as Employer" : "Register as Job Seeker"}</h3>
                  <form
                    method="POST"
                    id="contactForm"
                    name="contactForm"
                    className="contactForm"
                    onSubmit={handleForm}
                  >
                    <div className="row">
                     <div className="col-md-12">
                        <div className="form-group">
                          <label className="label" htmlFor="email">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e)=>{
                              setName(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="label" htmlFor="email">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="Email"
                             value={email}
                            onChange={(e)=>{
                              setEmail(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="label" htmlFor="subject">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            name="subject"
                            id="subject"
                            placeholder="Password"
                             value={password}
                            onChange={(e)=>{
                              setPassword(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                    <div className="col-md-12">
                        <div className="form-group">
                          <label className="label" htmlFor="email">
                            Contact
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="Contact"
                            minLength={10}
                            maxLength={10}
                            value={contact}
                            onChange={(e)=>{
                              setContact(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <input
                            type="submit"
                            value={isEmployer ? "Register as Employer" : "Register as Job Seeker"}
                            className="btn btn-primary w-100"
                          />
                          <div className="submitting" />
                        </div>
                      </div>
                      
                      {isEmployer && (
                         <div className="col-md-12">
                           <div className="mt-3 text-center">
                             Already have an account? <Link to="/login">Login as Employer</Link>
                           </div>
                         </div>
                       )}
                    </div>
                  </form>
                </div>
              </div>

            </div>
            </div>
        </>
    )
}