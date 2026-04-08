import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";

function Hero() {
  return (
    <PageHero
      title="Zerodha Clone"
      subtitle="Sleek, modern and intuitive trading platforms"
      className="border-bottom"
    >
      <p className="mt-3 mb-5">
        Check out our{" "}
        <Link to="/product" className="app-link-plain">
          investment offerings{" "}
          <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
        </Link>
      </p>
    </PageHero>
  );
}

export default Hero;
