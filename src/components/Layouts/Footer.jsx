import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <Link to="#top" className="smoothscroll scroll-top">
          <span className="icon-keyboard_arrow_up" />
        </Link>
        <div className="container">
          <div className="row mb-5">
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <h3>Search Trending</h3>
              <ul className="list-unstyled">
                <li>
                  <Link to="#">Web Design</Link>
                </li>
                <li>
                  <Link to="#">Graphic Design</Link>
                </li>
                <li>
                  <Link to="#">Web Developers</Link>
                </li>
                <li>
                  <Link to="#">Python</Link>
                </li>
                <li>
                  <Link to="#">HTML5</Link>
                </li>
                <li>
                  <Link to="#">CSS3</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <h3>Company</h3>
              <ul className="list-unstyled">
                <li>
                  <Link to="#">About Us</Link>
                </li>
                <li>
                  <Link to="#">Career</Link>
                </li>
                <li>
                  <Link to="#">Blog</Link>
                </li>
                <li>
                  <Link to="#">Resources</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <h3>Support</h3>
              <ul className="list-unstyled">
                <li>
                  <Link to="#">Support</Link>
                </li>
                <li>
                  <Link to="#">Privacy</Link>
                </li>
                <li>
                  <Link to="#">Terms of Service</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <h3>Contact Us</h3>
              <div className="footer-social">
                <Link to="#">
                  <span className="icon-facebook" />
                </Link>
                <Link to="#">
                  <span className="icon-twitter" />
                </Link>
                <Link to="#">
                  <span className="icon-instagram" />
                </Link>
                <Link to="#">
                  <span className="icon-linkedin" />
                </Link>
              </div>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-12">
              <p className="copyright">
                <small>
                  {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                  Copyright © All rights reserved | Ashish kumar@2025
                  
                </small>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
