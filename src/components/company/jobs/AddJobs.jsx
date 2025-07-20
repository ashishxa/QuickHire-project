import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../../Firebase";
import { toast } from "react-toastify";

export default function AddJobs() {
  const [jobName, setJobName] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [qualification, setQualification] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [vacancy, setVacancy] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();

    const data = {
      jobName,
      skills,
      location,
      vacancy,
      qualification,
      experience,
      description,
      salary,
      status: true,
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, "breeds"), data);
      toast.success("Job added successfully!");

      // Reset form fields
      setJobName("");
      setLocation("");
      setSalary("");
      setQualification("");
      setSkills("");
      setDescription("");
      setExperience("");
      setVacancy("");
    } catch (err) {
      toast.error("Error adding job: " + err.message);
    }
  };

  return (
    <>
       <section
    className="section-hero overlay inner-page bg-image"
    style={{ backgroundImage: 'url(/assets/images/hero_1.jpg)' }}
    id="home-section"
  >
    <div className="container">
      <div className="row">
        <div className="col-md-7">
          <h1 className="text-white font-weight-bold">Add Jobs</h1>
          <div className="custom-breadcrumbs">
            <a href="index.html">Home</a> <span className="mx-2 slash">/</span>
            <span className="text-white">
              <strong>Add Jobs</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>

      <div className="container my-5">
        <div className="row justify-content-center no-gutters">
          <div className="col-md-7" style={{ boxShadow: "0px 0px 15px gray" }}>
            <div className="contact-wrap w-100 p-md-5 p-4">
              <h3 className="mb-4">Add Jobs</h3>
              <form onSubmit={handleForm} className="contactForm">
                <div className="row">

                  <FormInput label="Job Title" value={jobName} onChange={setJobName} />
                  <FormInput label="Vacancy" value={vacancy} onChange={setVacancy} />
                  <FormInput label="Location" value={location} onChange={setLocation} />
                  <FormInput label="Skills" value={skills} onChange={setSkills} />
                  <FormInput label="Description" value={description} onChange={setDescription} />
                  <FormInput label="Salary" value={salary} onChange={setSalary} />
                  <FormInput label="Qualification" value={qualification} onChange={setQualification} />
                  <FormInput label="Experience" value={experience} onChange={setExperience} />

                  <div className="col-md-12">
                    <div className="form-group">
                      <input
                        type="submit"
                        value="Submit"
                        className="btn btn-primary"
                      />
                      <div className="submitting" />
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

// 🔄 Reusable input field component
function FormInput({ label, value, onChange }) {
  return (
    <div className="col-md-12">
      <div className="form-group">
        <label className="label">{label}</label>
        <input
          type="text"
          className="form-control"
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
