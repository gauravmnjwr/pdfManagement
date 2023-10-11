import React, { useEffect, useState } from "react";

function HomepageComponent() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateWindowDimensions = () => {
      const newHeight = window.innerWidth;
      setWidth(newHeight);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  return (
    <div className="user-sign-page homepage">
      {width > 150 && (
        <div className="abs-img-homepage">
          <img src="./assets/homepage.jpg" alt="" />
        </div>
      )}

      <div className="homepage-title-main">
        <div className="homepage-title">
          <h1 className="hover-2">
            Simplified PDF Management and Team Collaboration
          </h1>
          <p>
            PDF management app for uploading, viewing, and collaboration. Strong
            user authentication, secure sign-up/sign-in, private PDF sharing.
          </p>
          <div className="homepage-btn">
            <a href={`/signUp`}>SignUp</a>
            <a href={`/signIn`}>Log In</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomepageComponent;
