import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
          investment offerings <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </p>
    </PageHero>
  );
}

export default Hero;
