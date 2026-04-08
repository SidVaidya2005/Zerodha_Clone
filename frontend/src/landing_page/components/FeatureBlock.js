import React from "react";

function FeatureBlock({
  align = "left",
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  const imageEl = (
    <div className="col-6">
      <img src={imageURL} alt={productName} className="dark-invert" />
    </div>
  );

  const textEl = (
    <div className="col-6 p-5 mt-5">
      <h1>{productName}</h1>
      <p>{productDescription}</p>
      {(tryDemo || learnMore) && (
        <div className="d-flex align-items-center mt-4 app-gap-80">
          {tryDemo && (
            <a href={tryDemo} className="text-decoration-none">
              Try demo {"->"}
            </a>
          )}
          {learnMore && (
            <a href={learnMore} className="text-decoration-none">
              Learn more {"->"}
            </a>
          )}
        </div>
      )}
      {(googlePlay || appStore) && (
        <div className="d-flex align-items-center mt-4 app-gap-40">
          {googlePlay && (
            <a href={googlePlay}>
              <img src="media/images/googlePlayBadge.svg" alt="Google Play" />
            </a>
          )}
          {appStore && (
            <a href={appStore}>
              <img src="media/images/appstoreBadge.svg" alt="App Store" />
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="row">
        {align === "left" ? (
          <>
            {imageEl}
            {textEl}
          </>
        ) : (
          <>
            {textEl}
            {imageEl}
          </>
        )}
      </div>
    </div>
  );
}

export default FeatureBlock;
