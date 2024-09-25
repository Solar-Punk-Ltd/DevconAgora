import React from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import NavigationHeader from "../../components/NavigationHeader/NavigationHeader";
import { CATEGORIES } from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";

const SpacesPage: React.FC = () => {
  return (
    <div className="spaces">
      <NavigationHeader to="/home" />
      <NavigationFooter />
      <div className="spaces__content">
        {CATEGORIES.map((category) => (
          <div key={category}>
            <SpacesItem title={category} numberOfActiveUsers={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpacesPage;
