import React from "react";
import "./DevConMainBox.scss";
import { Link } from "react-router-dom";

interface DevConMainBoxProps {
  title: string;
  content?: string;
  showActiveVisitors?: boolean;
  activeVisitors?: number;
  furtherInfo?: string;
}

const DevConMainBox: React.FC<DevConMainBoxProps> = ({
  title,
  content,
  showActiveVisitors,
  activeVisitors,
  furtherInfo,
}) => {
  return (
    <Link to="/devconlounge">
      <div
        style={{
          // display: "flex",
          // justifyContent: "space-between",
          // alignItems: "center",
          padding: "10px",
          backgroundColor: "white",
          borderRadius: "8px",
          // height: "48px",
          boxSizing: "border-box",
          boxShadow: "0px 2px 4px 0px #1F1F231A",
        }}
      >
        <div
          style={{ fontSize: "18px", fontWeight: "400", marginBottom: "8px" }}
        >
          {title}
        </div>
        <div style={{ fontSize: "12px", marginBottom: "8px" }}>{content}</div>
        {showActiveVisitors ? (
          <div style={{ fontSize: "12px", fontWeight: "700" }}>
            {activeVisitors} active visitors
          </div>
        ) : null}
        {furtherInfo ? (
          <div
            style={{
              height: "29px",
              color: "white",
              backgroundColor: "#666666",
              fontSize: "12px",
              fontWeight: "400",
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
              padding: "8px",
              boxSizing: "border-box",
              marginTop: "12px",
            }}
          >
            {furtherInfo}
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export default DevConMainBox;
