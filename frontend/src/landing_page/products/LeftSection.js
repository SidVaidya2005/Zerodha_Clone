import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6">
          <img src={imageURL} alt={productName} className="dark-invert" />
        </div>
        <div className="col-6 p-5 mt-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          <div className="d-flex align-items-center mt-4 app-gap-80">
            <a href={tryDemo} className="text-decoration-none">
              Try demo {"->"}
            </a>
            <a href={learnMore} className="text-decoration-none">
              Learn more {"->"}
            </a>
          </div>
          <div className="d-flex align-items-center mt-4 app-gap-40">
            <a href={googlePlay}>
              <img src="media/images/googlePlayBadge.svg" alt="Google Play Badge" />
            </a>
            <a href={appStore}>
              <img src="media/images/appstoreBadge.svg" alt="App Store Badge" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
