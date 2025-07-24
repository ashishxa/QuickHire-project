import { addDoc, collection, Timestamp } from "firebase/firestore"
import { useState } from "react"
import { db } from "../../../Firebase"
import { toast } from "react-toastify"
import axios from "axios"
import { PacmanLoader } from "react-spinners"

export default function AddJobs(){
    const [jobTitle, setJobTitle] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [qualification,setQualification]=useState("")
  
  const [image, setImage] = useState({});
  const [imageName, setImageName] = useState("");
    const [load, setLoad]=useState(false)
    const handleForm=async (e)=>{
        e.preventDefault()
        setLoad(true)
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "quickHire"); // Replace with your upload preset

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dvywz29d5/image/upload`, // Replace with your Cloudinary cloud name
                formData
            );
            saveData(response.data.secure_url)
        } catch (error) {
            toast.error("Error uploading image:", error.message);
            // saveData("No_image")
            setLoad(false)

        }
    }
    const changeImage=(e)=>{
        setImageName(e.target.value)
        setImage(e.target.files[0]);
    }

    const saveData=async (imageUrl)=>{
         try{
            //insertion 
            let data={
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
            }
            // console.log(data);
            //addDoc(collection(db, "collectionName"), data)
            await addDoc(collection(db, "breeds"), data)
            toast.success("Breed added successfully!")
            setJobTitle("")
            setDescription("")
            setSkills("")
            setVacancy("")
            setLocation("")
            setSalary("")
            setQualification("")
            setExperience("")
            setImage("")
            setImageName("")
            // setUrl("")
        }
        catch(err){
            toast.error(err.message)
        }
        finally{
          setLoad(false)
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
            {
            load?
            <PacmanLoader color="#00BD56" size={30} cssOverride={{display:"block", margin:"0 auto"}} loading={load}/>
           
              :
              <div className="row justify-content-center no-gutters">
                <div className="col-md-7" style={{boxShadow:"0px 0px 15px gray"}}>
                  <div className="contact-wrap w-100 p-md-5 p-4">
                    <h3 className="mb-4">Add Jobs</h3>
                    <form
                      method="POST"
                      id="contactForm"
                      name="contactForm"
                      className="contactForm"
                      onSubmit={handleForm}
                    >
                     <div className="row">
                  {/* Job Title */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label">Job Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Job Title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Vacancy */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label">Vacancy</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Vacancy"
                        value={vacancy}
                        onChange={(e) => setVacancy(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label">Skills</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label">Description</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label">Salary</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label">Experience</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                      />
                    </div>
                  </div>
                   {/* Qualification */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="label">Qualification</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Qualification"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                      />
                    </div>
                  </div>

                 
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

                  {/* Submit */}
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
            }
            </div>
        </>
    )
}


//create your form 
// create input states using useState 
// add onchange and e.target.value 
// for image create two state one for imageName and one for image
// pass value as imageName and onchange setImageName(e.target.value) and setImage(e.target.files[0])
//onsubmit handle form and add e.preventDefault()
// first upload file on cloudinary, 
// create account on cloudinary and create presets from setting and upload, make sure signing mode is set to unsigned
// install axios
// with the given code upload file by changing preset name and cloud name 
// once file is uploaded pass secure url in saveData function
//in save data create your data and use addDoc to store data