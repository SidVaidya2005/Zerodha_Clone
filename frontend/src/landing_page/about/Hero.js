import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2 text-center">
          I built this Zerodha-inspired project from scratch
          <br />
          To sharpen my frontend and full-stack development skills.
        </h1>
      </div>

      <div className="row p-5 mt-5 border-top text-muted app-rich-text">
        <div className="col-6 p-5">
          <p>
            I am Siddarth Vaidya, currently studying at IIIT Naya Raipur. I
            started this clone project to understand how modern fintech
            platforms are designed and built with clean UI, reusable components,
            and responsive layouts.
          </p>
          <p>
            Instead of copying only the visuals, I focused on learning the full
            workflow: structuring pages, organizing components, and keeping the
            design consistent across sections.
          </p>
          <p>
            This project reflects my hands-on practice with React and frontend
            engineering, and it is one step in my journey to become a better
            software developer.
          </p>
        </div>
        <div className="col-6 p-5">
          <p>
            While building this, I paid attention to details like spacing,
            typography, reusable sections, and mobile-friendly behavior so the
            experience feels polished and familiar.
          </p>
          <p>
            <a href="" className="app-link-plain">
              This clone project
            </a>{" "}
            helped me improve how I think about product design and frontend
            architecture, not just writing code that works.
          </p>
          <p>
            I am continuously exploring new ideas and building more projects to
            strengthen my skills. Thanks for visiting and checking out my work.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
