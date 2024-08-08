import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Welcome4.scss";

interface Welcome4Props {}

const Welcome4: React.FC<Welcome4Props> = () => {
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
            <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
              SKIP
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome4;
