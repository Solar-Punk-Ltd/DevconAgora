import React from "react";
import { useNavigate } from "react-router-dom";

import HomeBackground from "../../assets/welcome-glass-effect.png";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { useGlobalState } from "../../GlobalStateContext";
import { CATEGORIES, ROUTES } from "../../utils/constants";

import "./SpacesPage.scss";

const SpacesPage: React.FC = () => {
  const { spacesActivity } = useGlobalState();
  const navigate = useNavigate();

  return (
    <div className="spaces">
      <NavigationFooter />
      <div className="spaces__background">
        <img src={HomeBackground} alt="" width="100%" height="100%" className="spaces__background__img" />
      </div>

      <div className="spaces__content">
        {CATEGORIES.map((c) => (
          <div key={c} onClick={() => navigate(`${ROUTES.TALKS}/${c}`)}>
            <SpacesItem title={c} numberOfActiveUsers={spacesActivity.get(c) || 0} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpacesPage;
