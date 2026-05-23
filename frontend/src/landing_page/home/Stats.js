import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Stats() {
  return (
    <section className="container app-trust-band">
      <div className="row align-items-start">
        <div className="col-12 col-md-5">
          <h1 className="app-trust-heading">Trust with confidence</h1>
          <div className="app-trust-blurb">
            <h3>Customer-first always</h3>
            <p className="text-muted">
              That's why 1.3+ crore customers trust Zerodha with ₹3.5+ lakh crores worth of equity
              investments.
            </p>
          </div>
          <div className="app-trust-blurb">
            <h3>No spam or gimmicks</h3>
            <p className="text-muted">
              No gimmicks, spam, "gamification", or annoying push notifications. High quality apps
              that you use at your pace, the way you like.
            </p>
          </div>
          <div className="app-trust-blurb">
            <h3>The Zerodha universe</h3>
            <p className="text-muted">
              Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer
              you tailored services specific to your needs.
            </p>
          </div>
          <div className="app-trust-blurb">
            <h3>Do better with money</h3>
            <p className="text-muted">
              With initiatives like Nudge and Kill Switch, we don't just facilitate transactions,
              but actively help you do better with your money.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-7">
          <img
            src="media/images/ecosystem.png"
            className="app-trust-image"
            alt="Zerodha ecosystem"
          />
          <div className="text-center app-trust-explore">
            <Link to="/product" className="app-link-plain">
              Explore our products <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/signup" className="app-link-plain">
              Try Kite demo <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
