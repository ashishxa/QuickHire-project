import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../Firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleForm = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        const userId = userCred.user.uid;
        getUserData(userId);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const getUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();

    if (userData?.status) {
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
      sessionStorage.setItem("name", userData?.name);
      sessionStorage.setItem("email", userData?.email);
      sessionStorage.setItem("userType", userData?.userType);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("isLogin", true);

      toast.success("Login successfully");

      if (userData.userType === 1) {
        navigate("/admin");
      } else if (userData.userType === 2) {
        navigate("/company");
      } else {
        navigate("/");
      }
    } else {
      toast.error("User data not found");
    }
  };

  const signInGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((userCred) => {
        const userId = userCred.user.uid;
        saveData(userId, userCred);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const saveData = async (userId, userCred) => {
    try {
      const data = {
        name: userCred.user.displayName,
        email: userCred.user.email,
        contact: userCred.user.phoneNumber,
        userId,
        userType: 3,
        status: true,
        createdAt: Timestamp.now(),
      };

      await setDoc(doc(db, "users", userId), data);
      toast.success("Register successfully!!");
      getUserData(userId);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
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
          
          .login-hero {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            padding: 120px 0 80px;
            position: relative;
            overflow: hidden;
          }
          
          .login-hero::before {
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
          
          .login-hero h1 {
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
          
          .login-container {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            min-height: 100vh;
            padding: 60px 0;
          }
          
          .login-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 24px;
            padding: 3rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(37, 99, 235, 0.1);
            position: relative;
            overflow: hidden;
          }
          
          .login-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          }
          
          .login-card h3 {
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
          
          .btn-google {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            border: none;
            border-radius: 12px;
            padding: 14px 24px;
            font-weight: 600;
            font-size: 1rem;
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
            margin-top: 1rem;
          }
          
          .btn-google:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          }
          
          .divider {
            text-align: center;
            margin: 2rem 0;
            position: relative;
          }
          
          .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e5e7eb;
          }
          
          .divider span {
            background: white;
            padding: 0 1rem;
            color: #6b7280;
            font-weight: 500;
            position: relative;
            z-index: 1;
          }
          
          .register-link {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
          }
          
          .register-link a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .register-link a:hover {
            color: #1e40af;
            text-decoration: underline;
          }
          
          .icon-google {
            margin-right: 8px;
          }
        `}
      </style>

      <div className="login-hero">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1>Welcome Back</h1>
              <div className="breadcrumb-custom">
                <Link to="/">Home</Link> <span style={{ margin: '0 10px', color: 'white' }}>/</span>
                <span style={{ color: 'white' }}>Login</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="login-card">
                <h3>Sign In to Quick Hire</h3>
                <form onSubmit={handleForm}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary-custom w-100"
                  >
                    Sign In
                  </button>
                </form>

                <div className="divider">
                  <span>or continue with</span>
                </div>

                <button
                  type="button"
                  onClick={signInGoogle}
                  className="btn btn-google w-100"
                >
                  <i className="bi bi-google icon-google"></i>
                  Sign In with Google
                </button>

                <div className="register-link">
                  Don't have an account? <Link to="/register">Create Account</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
