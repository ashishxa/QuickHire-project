import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";


import Contact from "./components/Contact";
import About from "./components/pages/About";

import Error from "./components/pages/Error";
import Layout from "./components/layouts/Layout";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { ToastContainer } from "react-toastify";

import AddJobs from "./components/company/jobs/AddJobs";
import ManageJobs from "./components/company/jobs/ManageJobs";

import Dashboard from "./components/company/pages/Dashboard";
import CompanyLayout from "./components/Layouts/CompanyLayout";
import ViewApp from "./components/company/jobs/ViewApp";


import AdminDashboard from "./components/admin/page/AdminDashboard";
import AdminLayout from "./components/Layouts/AdminLayout";
import AManageUser from "./components/admin/jobs/AManageUser";
import RecentJobs from "./components/admin/jobs/RecentJobs";
import AManageCompany from "./components/admin/jobs/AManageCompany";
import AManageJobs from "./components/admin/jobs/AManageJobs";
import ViewApplication from "./components/admin/jobs/ViewAppplication";
import AdminApplicationDetails from "./components/admin/jobs/ApplicationDetails";
import CompanyApplicationDetails from "./components/company/jobs/ApplicationDetails";
import Jobs from "./components/pages/jobs";
import JobApply from "./components/company/jobs/JobApply";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Public Layout Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
              <Route path="/jobs" element={<Jobs/>
              } />        
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="ApplyJobs/:id" element={<JobApply />} />
            <Route path="applications/:applicationId" element={<CompanyApplicationDetails />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="jobs/manageuse" element={<AManageUser />} />
            <Route path="jobs/recentjob" element={<RecentJobs />} />
            <Route path="jobs/managecompany" element={<AManageCompany />} />
            <Route path="jobs/managejob" element={<AManageJobs />} />
            <Route path="jobs/viewapplication" element={<ViewApplication />} />
            <Route path="applications/:id" element={<AdminApplicationDetails />} />
          </Route>

          {/* Company Routes */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="jobs/add" element={<AddJobs />} />
           
            <Route path="jobs/managejobs" element={<ManageJobs />} />
            <Route path="viewapp/:id" element={<ViewApp />} />
            <Route path="applications/:applicationId" element={<CompanyApplicationDetails />} />
         
          </Route>

          {/* Catch-All Route */}
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;
