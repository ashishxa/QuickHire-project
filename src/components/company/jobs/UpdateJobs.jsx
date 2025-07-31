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

  const nav = useNavigate();

  useEffect(() => {
    if (id) fetchData();
    else toast.error("Invalid job ID");
  }, [id]);

  const fetchData = async () => {
    try {
      const jobRef = doc(db, "jobs", id);
      const jobSnap = await getDoc(jobRef);

      if (!jobSnap.exists()) {
        toast.error("Job not found.");
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
    } catch (err) {
      console.error("Error while fetching job data:", err);
      toast.error("Error fetching job data.");
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
      toast.error("Failed to update job: " + err.message);
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
              <h1 className="text-white font-weight-bold">Update Jobs</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a> <span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Update Jobs</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row justify-content-center no-gutters">
          <div className="col-md-8" style={{ boxShadow: "0px 0px 15px gray" }}>
            <div className="contact-wrap w-100 p-md-5 p-4">
              <h3 className="mb-4">Edit Jobs</h3>

              {previousImg && (
                <img
                  src={previousImg}
                  alt="Previous"
                  style={{ height: "100px", width: "100px", objectFit: "cover" }}
                  className="d-block mx-auto rounded-circle mb-3"
                />
              )}

              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="New Preview"
                  style={{ height: "100px", width: "100px", objectFit: "cover" }}
                  className="d-block mx-auto rounded my-3"
                />
              )}

              <form onSubmit={handleForm} className="contactForm">
                <div className="row">
                  {[
                    { label: "Job Title", value: jobTitle, setter: setJobTitle },
                    { label: "Vacancy", value: vacancy, setter: setVacancy },
                    { label: "Location", value: location, setter: setLocation },
                    { label: "Skills", value: skills, setter: setSkills },
                    { label: "Description", value: description, setter: setDescription },
                    { label: "Salary", value: salary, setter: setSalary },
                    { label: "Experience", value: experience, setter: setExperience },
                    { label: "Qualification", value: qualification, setter: setQualification },
                  ].map((field, index) => (
                    <div className="col-md-6" key={index}>
                      <div className="form-group">
                        <label className="label">{field.label}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={field.label}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label">Banner</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={changeImage}
                      />
                      {imageName && (
                        <small className="text-success">Selected: {imageName}</small>
                      )}
                    </div>
                  </div>

                  <div className="col-md-12 text-center mt-4">
                    <div className="form-group">
                      <input
                        type="submit"
                        value="Update"
                        className="btn btn-primary px-5 py-2"
                      />
                    </div>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
