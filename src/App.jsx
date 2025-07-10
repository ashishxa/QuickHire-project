import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Blog from "./components/Blog";
import Blogsingle from "./components/Blogsingle";
import Contact from "./components/Contact";
import About from "./components/pages/About";
import Faq from "./components/pages/Faq";
import Gallery from "./components/pages/Gallery";
import Joblisting from "./components/pages/Joblistings";
import Jobsingle from "./components/pages/Jobsingle";
import Login from "./components/pages/Login";
import Portfolio from "./components/pages/Portfolio";
import Portfoliosingle from "./components/pages/Portfoliosingle";
import Postjob from "./components/pages/Postjob";
import Services from "./components/pages/Services";
import Testimonials from "./components/pages/Testimonials";

import Error from "./components/pages/Error";
import Layout from "./components/layouts/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blogsingle" element={<Blogsingle />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<Faq />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="joblisting" element={<Joblisting />} />
          <Route path="jobsingle" element={<Jobsingle />} />
          <Route path="login" element={<Login />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="postjob" element={<Postjob />} />
          <Route path="portfoliosingle" element={<Portfoliosingle />} />
          <Route path="services" element={<Services />} />
          <Route path="testimonials" element={<Testimonials />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
