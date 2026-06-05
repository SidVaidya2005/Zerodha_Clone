import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2 text-center">
          I rebuilt Zerodha from scratch
          <br />
          to learn how a product like this actually gets built.
        </h1>
      </div>

      <div className="row p-3 p-md-5 mt-5 border-top text-muted app-rich-text">
        <div className="col-12 col-md-6 p-3 p-md-5">
          <p>
            I'm Siddarth Vaidya, a student at IIIT Naya Raipur. I started this clone because I
            wanted to know how fintech apps are actually built, not just how they look.
          </p>
          <p>
            So I didn't stop at the visuals. I rebuilt the whole thing: laying out pages, splitting
            the UI into components I could reuse, and keeping it consistent as it grew.
          </p>
          <p>
            Honestly, most of what I know about React I picked up by getting this wrong a few times
            and fixing it.
          </p>
        </div>
        <div className="col-12 col-md-6 p-3 p-md-5">
          <p>
            The small stuff took the most time. Spacing, typography, how things behave on a phone.
            That's usually what separates a real product from a demo.
          </p>
          <p>
            Building{" "}
            <a
              href="https://github.com/SidVaidya2005"
              className="app-link-plain"
              target="_blank"
              rel="noopener noreferrer"
            >
              this clone
            </a>{" "}
            taught me that getting the code to run is the easy part. The hard part is making all the
            pieces fit together.
          </p>
          <p>I'm still building and breaking things. Thanks for stopping by.</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
