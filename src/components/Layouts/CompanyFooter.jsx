import { Link } from "react-router-dom";

export default function CompanyFooter() {
  return (
    <>
      <style>
        {`
          .company-footer {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: rgba(255, 255, 255, 0.8);
            padding: 5rem 0 2rem;
            position: relative;
            overflow: hidden;
          }
          
          .company-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.3;
          }
          
          .company-footer h3 {
            color: white;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            position: relative;
            display: inline-block;
          }
          
          .company-footer h3::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 40px;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            border-radius: 3px;
          }
          
          .company-footer ul {
            padding: 0;
            list-style: none;
          }
          
          .company-footer ul li {
            margin-bottom: 0.75rem;
          }
          
          .company-footer ul li a {
            color: rgba(255, 255, 255, 0.7);
            transition: all 0.3s ease;
            display: inline-block;
            position: relative;
          }
          
          .company-footer ul li a:hover {
            color: white;
            text-decoration: none;
            transform: translateX(5px);
          }
          
          .company-footer ul li a::before {
            content: '→';
            position: absolute;
            left: -20px;
            opacity: 0;
            transition: all 0.3s ease;
          }
          
          .company-footer ul li a:hover::before {
            opacity: 1;
            left: -15px;
          }
          
          .footer-social {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
          }
          
          .footer-social a {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s ease;
          }
          
          .footer-social a:hover {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            transform: translateY(-3px);
          }
          
          .scroll-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 100;
          }
          
          .scroll-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }
        `}
      </style>
      <footer className="company-footer">
        <Link to="#top" className="smoothscroll scroll-top">
          <span className="icon-keyboard_arrow_up" />
        </Link>
        <div className="container">
          <div className="row mb-5">
            <div className="col-6 col-md-3 mb-4 mb-md-0">
              <h3>Search Trending</h3>
              <ul>
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
              <ul>
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
              <ul>
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
