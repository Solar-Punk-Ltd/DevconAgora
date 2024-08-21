import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Welcome3.scss";

const Welcome3: React.FC = () => {
  return (
    <>
      <div className="welcome-layout welcome-font">
        <div className="welcome-content">
          <div className="welcome-header">Welcome on DevCon Agora</div>
          <div className="subtext">
            <div className="welcome-subtext1">
              Decentralized Data Storage - SWARM
            </div>
            <div className="welcome-subtext2">
              Our data is stored on the SWARM network, ensuring security and
              reliability.
            </div>
          </div>
        </div>
        <div className="bottom">
          <Link to="/welcome4">
            <Button>Next</Button>
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

export default Welcome3;
