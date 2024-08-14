import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Welcome1.scss";

const Welcome1: React.FC = () => {
  return (
    <>
      <div className="welcome-layout welcome-font">
        <div className="welcome-content">
          <div className="welcome-header">Welcome on DevCon Agora</div>
          <div className="subtext">
            <div className="welcome-subtext1">
              Be Part of the Ethereum Community
            </div>
            <div className="welcome-subtext2">
              Contribute of the Growth of the Ecosystem.
            </div>
          </div>
        </div>
        <div className="bottom">
          <Link to="/welcome2">
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

export default Welcome1;
