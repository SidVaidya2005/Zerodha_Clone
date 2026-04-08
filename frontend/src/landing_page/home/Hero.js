import React from "react";
import PageHero from "../components/PageHero";
import SignupCTAButton from "../components/SignupCTAButton";

function Hero() {
  return (
    <PageHero
      imageURL="media/images/homeHero.png"
      imageAlt="Hero Image"
      title="Invest in everything"
      subtitle="Online platform to invest in stocks, derivatives, mutual funds, and more"
    >
      <SignupCTAButton />
    </PageHero>
  );
}

export default Hero;
