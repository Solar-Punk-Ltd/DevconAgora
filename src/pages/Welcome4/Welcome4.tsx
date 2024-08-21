import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Welcome4.scss";

const Welcome4: React.FC = () => {
  return (
    <>
      <div className="welcome-layout welcome-font">
        <div className="welcome-content">
          <div className="welcome-header">Welcome on DevCon Agora</div>
          <div className="subtext">
            <div className="welcome-subtext1">Claim Your Reward</div>
            <div className="welcome-subtext2">
              You can claim your reward at the SWARM booth.
            </div>
          </div>
        </div>
        <div className="bottom">
          <Link to="/openprofile">
            <Button>Let’s go</Button>
          </Link>
          <div className="bottom-text">
            I know everything{" "}
            <Link to="/openprofile">
              <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
                SKIP
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome4;
