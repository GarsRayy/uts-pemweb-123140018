import React from 'react';
import { Github, Globe } from 'lucide-react';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="footer-content">
          <p>
            <strong>Metropolitan Museum Explorer</strong>
            <br />
            Dibuat menggunakan{" "}
            <a href="https://metmuseum.github.io/" target="_blank" rel="noopener noreferrer">
              Metropolitan Museum of Art Collection API
            </a>.
          </p>
          <p>Ini adalah proyek UTS. Bukan situs web resmi The Met.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/GarsRayy/uts-pemweb-123140018" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={20} />
          </a>
          <a href="https://metmuseum.github.io/" target="_blank" rel="noopener noreferrer" aria-label="Met API">
            <Globe size={20} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} - Garis Rayya Rabbani 123140018.
      </div>
    </footer>
  );
}

export default Footer;