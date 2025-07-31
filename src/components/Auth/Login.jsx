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
      <section
        className="section-hero overlay inner-page bg-image"
        style={{ backgroundImage: "url(/assets/images/hero_1.jpg)" }}
        id="home-section"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Account Login</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white">
                  <strong>Account Login</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="contact-wrap p-md-5 p-4 shadow rounded bg-white">
              <h3 className="mb-4 text-center">Sign in to Quick Hire</h3>
              <form onSubmit={handleForm} className="contactForm">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <input
                        type="submit"
                        value="Login"
                        className="btn btn-primary w-100"
                      />
                    </div>
                  </div>
                </div>
              </form>

              <button
                type="button"
                onClick={signInGoogle}
                className="btn btn-danger w-100"
              >
                <i className="bi bi-google"></i> Sign In with Google
              </button>

              <div className="mt-3 text-center">
                Don't have an account? <Link to="/register">Register Here!</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
