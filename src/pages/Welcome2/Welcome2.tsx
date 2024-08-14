import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Welcome2.scss";

const Welcome2: React.FC = () => {
  return (
    <>
      <div className="welcome-layout welcome-font">
        <div className="welcome-content">
          <div className="welcome-header">Welcome on DevCon Agora</div>
          <div className="subtext">
            <div className="welcome-subtext1">Reward</div>
            <div className="welcome-subtext2">Be active!</div>
            <div className="welcome-subtext2">
              Comment and contribute to the community.
            </div>
            <div className="welcome-subtext2">
              Receive 10 BZZ tokens for 10 valuable contributions.
            </div>
          </div>
        </div>
        <div className="bottom">
          <Link to="/welcome3">
            <Button>Next</Button>
          </Link>
          <div className="bottom-text">
            I know everything{" "}
            <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
              SKIP
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome2;
