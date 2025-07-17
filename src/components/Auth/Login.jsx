import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { auth } from "../../Firebase";

export default function Login(){
    const [email, setEmail]=useState("admin@gmail.com")
    const [password, setPassword]=useState("")
    const changeEmail=(e)=>{
      console.log(e);
     
      setEmail(e.target.value)
    }
     let nav= useNavigate()
    const handleForm=(e)=>{
      e.preventDefault()  
    
      signInWithEmailAndPassword(auth, email, password)
         .then((userCred)=>{
           console.log("sign in", userCred.user.uid);
           toast.success("Login successfully!!")
           nav("/")
         })
         .catch((error)=>{
           toast.error(error.message);
         })
       }
     
       const signInGoogle=()=>{
         let provider=new GoogleAuthProvider()
         signInWithPopup(auth, provider)
         .then((userCred)=>{
             console.log(userCred.user.uid);
             toast.success("Login successfully")
              nav("/")
         })
         .catch((err)=>{
           toast.error(err.message)
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
          <h1 className="text-white font-weight-bold">Login</h1>
          <div className="custom-breadcrumbs">
            <a href="index.html">Home</a> <span className="mx-2 slash">/</span>
            <span className="text-white">
              <strong>Login</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
            <div className="container my-3">
               
            <div className="row no-gutters">
              <div className="col-md-7">
                <div className="contact-wrap w-100 p-md-5 p-4">
                  <h3 className="mb-4">Login  Quick Hire</h3>
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
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={changeEmail}
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
                          <input
                            type="submit"
                            defaultValue="Submit"
                            className="btn btn-primary"
                          />
                          <div className="submitting" />
                        </div>
                      </div>
                    </div>
                  </form>
                  <button type="button" onClick={signInGoogle} className="btn btn-danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
</svg> Sign In with google</button>
                  {/* {email} */}
                  <div>Don't have an account? <Link to={"/register"}>Register Here!</Link></div>
                </div>
              </div>
              <div className="col-md-5 d-flex align-items-stretch">
                <div
                  className="info-wrap w-100 p-5 img"
                 
                ></div>
              </div>
            </div>
            </div>

        </>
    )
}