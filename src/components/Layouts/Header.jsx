import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="site-navbar mt-3">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="site-logo col-6">
              <Link to="/"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-workspace" viewBox="0 0 16 16">
  <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
  <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"/>
</svg> Quick Hire</Link>
            </div>
            <nav className="mx-auto site-navigation">
              <ul className="site-menu js-clone-nav d-none d-xl-block ml-0 pl-0">
                <li>
                  <Link to="/" className="nav-Link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about">
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
