import React from "react";
import { Link } from "react-router-dom";

const partnerCards = [
  {
    logo: "media/images/zerodhaFundhouse.png",
    description:
      "Our asset management venture that is creating simple and transparent index funds to help you save for your goals.",
  },
  {
    logo: "media/images/sensibullLogo.svg",
    description:
      "Options trading platform that lets you create strategies, analyze positions, and examine data points like open interest, FII/DII, and more.",
  },
  {
    logo: "media/images/tijori.svg",
    description:
      "Investment research platform that offers detailed insights on stocks, sectors, supply chains, and more.",
  },
  {
    logo: "media/images/streakLogo.png",
    description:
      "Systematic trading platform that allows you to create and backtest strategies without coding.",
  },
  {
    logo: "media/images/smallcaseLogo.png",
    description:
      "Thematic investing platform that helps you invest in diversified baskets of stocks on ETFs.",
  },
  {
    logo: "media/images/dittoLogo.png",
    description:
      "Personalized advice on life and health insurance. No spam and no mis-selling.",
  },
];

function Universe() {
  return (
    <div className="container mt-5 app-universe-container">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        {partnerCards.map((partner, index) => (
          <div className="col-4 p-3 mt-5" key={`${partner.logo}-${index}`}>
            <img
              src={partner.logo}
              alt="Partner platform"
              className="app-universe-logo"
            />
            <p className="text-small text-muted mt-3">{partner.description}</p>
          </div>
        ))}
        <Link
          to="/signup"
          className="p-2 btn btn-primary fs-5 mb-5 app-cta-button"
        >
          Signup Now
        </Link>
      </div>
    </div>
  );
}

export default Universe;
