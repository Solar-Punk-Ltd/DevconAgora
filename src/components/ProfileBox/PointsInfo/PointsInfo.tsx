import React from "react";
import "./PointsInfo.scss";

interface PointsInfoProps {
  points: number;
}

const PointsInfo: React.FC<PointsInfoProps> = ({ points }) => {
  return (
    <div className="points-info">
      {points < 10 ? (
        <>
          <span className="points-info__points-emphasize">
            {`${10 - points} more points`}
          </span>{" "}
          to <span className="points-info__BZZ-emphasize">BZZ Tokens</span>
        </>
      ) : (
        <>
          <span>You&lsquo;ve collected all your points.</span>
          <span className="points-info__BZZ-emphasize">
            Get your BZZ token.
          </span>
        </>
      )}
    </div>
  );
};

export default PointsInfo;
