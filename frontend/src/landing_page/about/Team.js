import React from "react";

function Team() {
  return (
    <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center ">People</h1>
      </div>

      <div className="row p-3 text-muted app-rich-text">
        <div className="col-6 p-3 text-center">
          <img src="frontend/public/media/images/MyImage.jpg" className="app-team-avatar" />
          <h4 className="mt-5">Siddarth Vaidya</h4>
          <h6>Student Developer</h6>
        </div>
        <div className="col-6 p-3">
          <p>
            I am Siddarth Vaidya, a student at IIIT Naya Raipur, and I created
            this Zerodha-inspired clone project to challenge myself with real
            world frontend development and product-style UI building.
          </p>
          <p>
            I built this project from scratch to understand component-based
            architecture, responsive layouts, and how to maintain a clean and
            consistent user experience across pages.
          </p>
          <p>
            I enjoy learning by building and continuously improving each
            project.
          </p>
          <p>
            Connect on{" "}
            <a
              href="mailto:siddarthvaidya2005@gmail.com"
              target="_blank"
              rel="noreferrer"
            >
              Email
            </a>{" "}
            /{" "}
            <a
              href="https://github.com/SidVaidya2005"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>{" "}
            /{" "}
            <a
              href="https://www.linkedin.com/in/siddarth-vaidya-885871239"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
