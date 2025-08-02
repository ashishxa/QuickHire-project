import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../Firebase";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateJobs() {
  const { id } = useParams();
  const [jobTitle, setJobTitle] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [previousImg, setPreviousImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    if (id) fetchData();
    else {
      toast.error("Invalid job ID");
      setLoading(false);
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const jobRef = doc(db, "jobs", id);
      const jobSnap = await getDoc(jobRef);

      if (!jobSnap.exists()) {
        toast.error("Job not found.");
        setLoading(false);
        return;
      }

      const jobData = jobSnap.data();
      setJobTitle(jobData.jobTitle || "");
      setVacancy(jobData.vacancy || "");
      setLocation(jobData.location || "");
      setSkills(jobData.skills || "");
      setDescription(jobData.description || "");
      setSalary(jobData.salary || "");
      setExperience(jobData.experience || "");
      setQualification(jobData.qualification || "");
      setPreviousImg(jobData.image || "");
      setLoading(false);
    } catch (err) {
      console.error("Error while fetching job data:", err);
      toast.error("Error fetching job data.");
      setLoading(false);
    }
  };

  const changeImage = (e) => {
    if (e.target.files.length > 0) {
      setImageName(e.target.files[0].name);
      setImage(e.target.files[0]);
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setUpdating(true);

    if (image && imageName) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "quickHire");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dvywz29d5/image/upload`,
          formData
        );
        saveData(response.data.secure_url);
      } catch (error) {
        toast.error("Error uploading image");
        setUpdating(false);
      }
    } else {
      saveData(previousImg);
    }
  };

  const saveData = async (imageUrl) => {
    try {
      const data = {
        jobTitle,
        vacancy,
        location,
        skills,
        description,
        salary,
        experience,
        qualification,
        image: imageUrl,
        status: true,
        createdAt: Timestamp.now(),
      };

      await updateDoc(doc(db, "jobs", id), data);
      toast.success("Job updated successfully!");
      nav("/company/jobs/managejobs");
    } catch (err) {
      console.error("Error while updating job:", err);
      toast.error("Error updating job.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .company-dashboard {
            font-family: 'Inter', sans-serif;
          }
          
          .company-dashboard h1, .company-dashboard h2, .company-dashboard h3, .company-dashboard h4 {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
          }
          
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
          
          .dashboard-hero h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 1rem;
          }
          
          .dashboard-hero .breadcrumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 25px;
            padding: 0.5rem 1.5rem;
            display: inline-block;
            backdrop-filter: blur(10px);
          }
          
          .dashboard-hero .breadcrumb a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: color 0.3s ease;
          }
          
          .dashboard-hero .breadcrumb a:hover {
            color: white;
          }
          
          .content-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(59, 130, 246, 0.1);
            overflow: hidden;
          }
          
          .content-card .card-header {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-bottom: 1px solid rgba(59, 130, 246, 0.1);
            padding: 1.5rem;
          }
          
          .content-card .card-header h4 {
            color: #1e293b;
            font-weight: 600;
            margin: 0;
          }
          
          .content-card .card-body {
            padding: 2rem;
          }
          
          .form-control {
            border-radius: 10px;
            border: 1px solid rgba(59, 130, 246, 0.2);
            padding: 0.75rem 1rem;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            background: #f8fafc;
          }
          
          .form-control:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
            background: white;
          }
          
          .form-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
          }
          
          .btn-modern {
            border-radius: 10px;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            transition: all 0.3s ease;
            border: none;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .btn-modern:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            text-decoration: none;
          }
          
          .btn-primary-modern {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
          }
          
          .btn-secondary-modern {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            color: white;
          }
          
          .file-input-wrapper {
            position: relative;
            display: inline-block;
            width: 100%;
          }
          
          .file-input-wrapper input[type=file] {
            position: absolute;
            left: -9999px;
          }
          
          .file-input-label {
            display: block;
            padding: 0.75rem 1rem;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 2px dashed rgba(59, 130, 246, 0.3);
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #6b7280;
            font-weight: 500;
          }
          
          .file-input-label:hover {
            border-color: #3b82f6;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            color: #3b82f6;
          }
          
          .file-input-label.has-file {
            border-color: #10b981;
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            color: #059669;
          }
          
          .current-image {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(59, 130, 246, 0.05);
            border-radius: 10px;
            border: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          .current-image img {
            max-width: 200px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          
          .loading-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
        `}
      </style>
      
      <div className="site-wrap company-dashboard">
        <section className="dashboard-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1>Update Job</h1>
                <div className="breadcrumb">
                  <a href="/company">Dashboard</a> 
                  <span className="mx-2">/</span>
                  <a href="/company/jobs/managejobs">Manage Jobs</a>
                  <span className="mx-2">/</span>
                  <span style={{ color: 'white', fontWeight: '600' }}>Update Job</span>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '15px', 
                  padding: '1rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <small style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Update job details</small>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    {sessionStorage.getItem("name") || "Company"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section bg-light" style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="content-card">
                  <div className="card-header">
                    <h4>Update Job Details</h4>
                  </div>
                  <div className="card-body">
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleForm}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Job Title *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                              required
                              placeholder="Enter job title"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Number of Vacancies *</label>
                            <input
                              type="number"
                              className="form-control"
                              value={vacancy}
                              onChange={(e) => setVacancy(e.target.value)}
                              required
                              placeholder="Enter number of vacancies"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Location *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              required
                              placeholder="Enter job location"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Salary *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={salary}
                              onChange={(e) => setSalary(e.target.value)}
                              required
                              placeholder="Enter salary range"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Experience Required *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={experience}
                              onChange={(e) => setExperience(e.target.value)}
                              required
                              placeholder="e.g., 2-3 years"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Qualification *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={qualification}
                              onChange={(e) => setQualification(e.target.value)}
                              required
                              placeholder="e.g., Bachelor's Degree"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Required Skills *</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            required
                            placeholder="Enter required skills (comma separated)"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Job Description *</label>
                          <textarea
                            className="form-control"
                            rows="5"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Enter detailed job description"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="form-label">Company Image</label>
                          {previousImg && (
                            <div className="current-image">
                              <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                                Current Image:
                              </p>
                              <img src={previousImg} alt="Current company image" />
                            </div>
                          )}
                          <div className="file-input-wrapper" style={{ marginTop: '1rem' }}>
                            <input
                              type="file"
                              id="imageInput"
                              onChange={changeImage}
                              accept="image/*"
                            />
                            <label 
                              htmlFor="imageInput" 
                              className={`file-input-label ${imageName ? 'has-file' : ''}`}
                            >
                              {imageName ? (
                                <>
                                  <i className="icon-check-circle" style={{ marginRight: '0.5rem' }}></i>
                                  {imageName}
                                </>
                              ) : (
                                <>
                                  <i className="icon-upload" style={{ marginRight: '0.5rem' }}></i>
                                  Choose New Image (Optional)
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        <div className="d-flex gap-3">
                          <button type="submit" className="btn-modern btn-primary-modern" disabled={updating}>
                            {updating ? (
                              <>
                                <div className="spinner-border spinner-border-sm" role="status" style={{ marginRight: '0.5rem' }}>
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                Updating Job...
                              </>
                            ) : (
                              <>
                                <i className="icon-check"></i>
                                Update Job
                              </>
                            )}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => nav("/company/jobs/managejobs")} 
                            className="btn-modern btn-secondary-modern"
                          >
                            <i className="icon-arrow-left"></i>
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {updating && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 mb-0">Updating your job posting...</p>
          </div>
        </div>
      )}
    </>
  );
}
