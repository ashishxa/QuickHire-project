import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <style>
        {`
          .site-footer {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 3rem 0 1rem;
            position: relative;
            overflow: hidden;
          }
          
          .site-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          
          .site-footer h3 {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            color: #87ceeb;
            margin-bottom: 1.5rem;
            position: relative;
            animation: fadeIn 0.8s ease forwards;
          }
          
          .site-footer h3::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 30px;
            height: 2px;
            background: #87ceeb;
            border-radius: 1px;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.5s ease;
          }
          
          .site-footer h3:hover::after {
            transform: scaleX(1);
          }
          
          .site-footer ul li {
            margin-bottom: 0.5rem;
            opacity: 0;
            animation: fadeInRight 0.5s ease forwards;
          }
          
          .site-footer ul li:nth-child(1) { animation-delay: 0.1s; }
          .site-footer ul li:nth-child(2) { animation-delay: 0.2s; }
          .site-footer ul li:nth-child(3) { animation-delay: 0.3s; }
          .site-footer ul li:nth-child(4) { animation-delay: 0.4s; }
          .site-footer ul li:nth-child(5) { animation-delay: 0.5s; }
          
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .site-footer ul li a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-weight: 400;
            transition: all 0.3s ease;
            position: relative;
            padding-left: 0;
          }
          
          .site-footer ul li a::before {
            content: '→';
            position: absolute;
            left: -15px;
            opacity: 0;
            transition: all 0.3s ease;
            color: #87ceeb;
          }
          
          .site-footer ul li a:hover {
            color: #87ceeb;
            padding-left: 15px;
          }
          
          .site-footer ul li a:hover::before {
            opacity: 1;
          }
          
          .footer-social a {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            margin-right: 10px;
            color: white;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            opacity: 0;
            animation: fadeIn 0.5s ease forwards;
          }
          
          .footer-social a:nth-child(1) { animation-delay: 0.1s; }
          .footer-social a:nth-child(2) { animation-delay: 0.2s; }
          .footer-social a:nth-child(3) { animation-delay: 0.3s; }
          .footer-social a:nth-child(4) { animation-delay: 0.4s; }
          
          .footer-social a::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .footer-social a:hover::before {
            left: 100%;
          }
          
          .footer-social a:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
          
          .copyright {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 1.5rem;
            margin-top: 3rem;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
            animation: fadeIn 1s ease forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <footer className="site-footer">
        <Link to="#top" className="smoothscroll scroll-top">
          <span className="icon-keyboard_arrow_up" />
        </Link>
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-4 mb-4 mb-md-0">
              <h3>Quick Hire</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                Connecting talented professionals with amazing opportunities. 
                Find your dream job or hire the perfect candidate.
              </p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <h3>Quick Links</h3>
              <ul className="list-unstyled">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/jobs">Browse Jobs</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <h3>Connect With Us</h3>
              <div className="footer-social">
                <Link to="#" title="Facebook">
                  <span className="icon-facebook" />
                </Link>
                <Link to="#" title="Twitter">
                  <span className="icon-twitter" />
                </Link>
                <Link to="#" title="Instagram">
                  <span className="icon-instagram" />
                </Link>
                <Link to="#" title="LinkedIn">
                  <span className="icon-linkedin" />
                </Link>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '1rem', fontSize: '0.9rem' }}>
                Stay updated with the latest job opportunities and career tips.
              </p>
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
