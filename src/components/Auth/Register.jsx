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
     
     // Store user data as a single object for easier access
     const userObject = {
       name: userData?.name,
       email: userData?.email,
       userType: userData?.userType,
       userId: userId,
       isLogin: true
     };
     sessionStorage.setItem("user", JSON.stringify(userObject));
     
     // Keep individual items for backward compatibility
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
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
            
            * {
              font-family: 'Inter', sans-serif;
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Poppins', sans-serif;
              font-weight: 600;
            }
            
            .register-hero {
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
              padding: 120px 0 80px;
              position: relative;
              overflow: hidden;
            }
            
            .register-hero::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: 
                radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
              opacity: 0.6;
            }
            
            .register-hero h1 {
              font-size: 3.5rem;
              font-weight: 900;
              color: #ffffff;
              text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
              margin-bottom: 1rem;
              position: relative;
              z-index: 2;
            }
            
            .breadcrumb-custom {
              background: rgba(255, 255, 255, 0.15);
              backdrop-filter: blur(10px);
              border-radius: 25px;
              padding: 1rem 2rem;
              display: inline-block;
              border: 1px solid rgba(255, 255, 255, 0.2);
              position: relative;
              z-index: 2;
            }
            
            .breadcrumb-custom a {
              color: #ffffff;
              text-decoration: none;
              font-weight: 500;
              transition: all 0.3s ease;
            }
            
            .breadcrumb-custom a:hover {
              color: #e0f2fe;
            }
            
            .employer-alert {
              background: rgba(59, 130, 246, 0.2);
              border: 1px solid rgba(59, 130, 246, 0.3);
              border-radius: 12px;
              padding: 1rem 1.5rem;
              margin-top: 1.5rem;
              position: relative;
              z-index: 2;
            }
            
            .employer-alert strong {
              color: #ffffff;
              font-weight: 600;
            }
            
            .register-container {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              min-height: 100vh;
              padding: 60px 0;
            }
            
            .register-card {
              background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
              border-radius: 24px;
              padding: 3rem;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
              border: 1px solid rgba(37, 99, 235, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .register-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            }
            
            .register-card h3 {
              font-size: 2rem;
              font-weight: 800;
              background: linear-gradient(135deg, #1e3c72 0%, #2563eb 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 2rem;
              text-align: center;
            }
            
            .form-group {
              margin-bottom: 1.5rem;
            }
            
            .form-group label {
              font-weight: 600;
              color: #374151;
              margin-bottom: 0.5rem;
              display: block;
              font-size: 0.95rem;
            }
            
            .form-control {
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              padding: 12px 16px;
              font-size: 1rem;
              transition: all 0.3s ease;
              background: #ffffff;
            }
            
            .form-control:focus {
              border-color: #3b82f6;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
              outline: none;
            }
            
            .form-control::placeholder {
              color: #9ca3af;
            }
            
            .btn-primary-custom {
              background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
              border: none;
              border-radius: 12px;
              padding: 14px 24px;
              font-weight: 600;
              font-size: 1rem;
              color: white;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            }
            
            .btn-primary-custom:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
              background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            }
            
            .login-link {
              text-align: center;
              margin-top: 2rem;
              padding-top: 1.5rem;
              border-top: 1px solid #e5e7eb;
            }
            
            .login-link a {
              color: #3b82f6;
              text-decoration: none;
              font-weight: 600;
              transition: all 0.3s ease;
            }
            
            .login-link a:hover {
              color: #1e40af;
              text-decoration: underline;
            }
            
            .user-type-badge {
              display: inline-block;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 20px;
              font-size: 0.875rem;
              font-weight: 600;
              margin-bottom: 1rem;
            }
            
            .employer-badge {
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }
          `}
        </style>

        <div className="register-hero">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1>{isEmployer ? "Join as Employer" : "Join Quick Hire"}</h1>
                <div className="breadcrumb-custom">
                  <Link to="/">Home</Link> <span style={{ margin: '0 10px', color: 'white' }}>/</span>
                  <span style={{ color: 'white' }}>Register</span>
                </div>
                {isEmployer && (
                  <div className="employer-alert">
                    <strong>🎯 You are registering as an Employer</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="register-container">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="register-card">
                  <h3>{isEmployer ? "Create Employer Account" : "Create Your Account"}</h3>
                  
                  {isEmployer && (
                    <div className="text-center">
                      <span className="user-type-badge employer-badge">Employer Account</span>
                    </div>
                  )}
                  
                  <form onSubmit={handleForm}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter your contact number"
                        minLength={10}
                        maxLength={10}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="btn btn-primary-custom w-100"
                    >
                      {isEmployer ? "Create Employer Account" : "Create Account"}
                    </button>
                  </form>
                  
                  {isEmployer && (
                    <div className="login-link">
                      Already have an account? <Link to="/login">Sign In as Employer</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
    )
}