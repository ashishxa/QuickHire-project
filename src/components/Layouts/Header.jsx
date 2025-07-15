import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="site-navbar mt-3">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="site-logo col-6">
              <Link to="/">Quick Hire</Link>
            </div>
            <nav className="mx-auto site-navigation">
              <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                <li>
                  <Link to="/" className="nav-Link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="active">
                    About
                  </Link>
                </li>
                <li className="has-children">
                  <Link to="/joblisting">Job Listings</Link>
                  <ul className="dropdown">
                    <li>
                      <Link to="/jobsingle">Job Single</Link>
                    </li>
                    <li>
                      <Link to="/postjob">Post a Job</Link>
                    </li>
                  </ul>
                </li>
                <li className="has-children">
                  <Link to="/services">Pages</Link>
                  <ul className="dropdown">
                    <li>
                      <Link to="/services">Services</Link>
                    </li>
                    {/* You do not have a ServiceSingle route, update as needed */}
                    <li>
                      <Link to="/blogsingle">Blog Single</Link>
                    </li>
                    <li>
                      <Link to="/portfolio">Portfolio</Link>
                    </li>
                    <li>
                      <Link to="/portfoliosingle">Portfolio Single</Link>
                    </li>
                    <li>
                      <Link to="/testimonials">Testimonials</Link>
                    </li>
                    <li>
                      <Link to="/faq">Frequently Ask Questions</Link>
                    </li>
                    <li>
                      <Link to="/gallery">Gallery</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/blog">Blog</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li className="d-lg-none">
                  <Link to="/Register">
                    <span className="mr-2">+</span> Register
                  </Link>
                </li>
                <li className="d-lg-none">
                  <Link to="/login">Log In</Link>
                </li>
              </ul>
            </nav>
            <div className="right-cta-menu text-right d-flex align-items-center col-6">
              <div className="ml-auto">
                <Link
                  to="/Register"
                  className="btn btn-outline-white border-width-2 d-none d-lg-inline-block"
                >
                  <span className="mr-2 icon-add" />
                  Register
                </Link>
                <Link
                  to="/login"
                  className="btn btn-primary border-width-2 d-none d-lg-inline-block"
                >
                  <span className="mr-2 icon-lock_outline" />
                  Log In
                </Link>
              </div>
              <Link
                to="#"
                className="site-menu-toggle js-menu-toggle d-inline-block d-xl-none mt-lg-2 ml-3"
              >
                <span className="icon-menu h3 m-0 p-0 mt-2" />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
