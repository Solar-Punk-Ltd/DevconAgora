import React from "react";
import { useNavigate } from "react-router-dom";

// import HomeBackground from "../../assets/welcome-glass-effect.png";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { useGlobalState } from "../../contexts/global";
import { CATEGORIES, ROUTES, SPACES_KEY } from "../../utils/constants";

import "./Spaces.scss";

const Spaces: React.FC = () => {
  const { spacesActivity } = useGlobalState();
  const navigate = useNavigate();

  return (
    <div className={SPACES_KEY}>
      <NavigationFooter />
      <div className="spaces__background grid">
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

export default Spaces;
