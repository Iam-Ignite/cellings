"use client"
import Link from "next/link";
import React, { useState } from "react";
import BritishGypsumSolutions from "./components/BritishGypsumSolutions";
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* <!-- Header --> */}
      {/* <header>
      <div className="container header-content">
        <div className="logo">
          Floor<span>Vision</span>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          ☰
        </button>
        <nav>
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#technology">Technology</a></li>
            <li><Link href="/room" className="cta-button">Start Designing</Link></li>
          </ul>
        </nav>
      </div>
    </header> */}

      {/* <!-- Hero Section --> */}
      {/* <section className="hero">
        <div className="container hero-content">
          <h1>Visualize Your Dream Home Floor</h1>
          <p>
            Experiment with different flooring options in a realistic 3D
            environment that brings your vision to life
          </p>
          <Link href="/room" className="start-designing-button">
            Start Designing
          </Link>
          <div className="hero-3d-preview">
            <Room home
            />
          </div>
        </div>
      </section> */}

      <BritishGypsumSolutions/>

   
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>FloorVision</h4>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Our Team</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#">Features</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Support</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Design Tips</a>
                </li>
                <li>
                  <a href="#">Tutorials</a>
                </li>
                <li>
                  <a href="#">Documentation</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                <li>
                  <a href="#">Twitter</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">LinkedIn</a>
                </li>
                <li>
                  <a href="#">YouTube</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 FloorVision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
