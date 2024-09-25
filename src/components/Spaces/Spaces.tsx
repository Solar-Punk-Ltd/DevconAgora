import React from "react";
import "./Spaces.scss";
import SpacesItem from "./SpacesItem/SpacesItem";
import { CATEGORIES } from "../../utils/constants";

const Spaces: React.FC = () => {
  return (
    <div>
      <div className="recent-rooms">
        <div style={{}} className="recent-rooms__title">
          Buzz spaces
        </div>
      </div>
      <div>
        {CATEGORIES.map((category) => (
          <div key={category}>
            <SpacesItem title={category} numberOfActiveUsers={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spaces;
