import React from "react";
import "./SpacesPage.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";
import { CATEGORIES } from "../../utils/constants";
import SpacesItem from "../../components/Spaces/SpacesItem/SpacesItem";
import { useGlobalState } from "../../GlobalStateContext";
import HomeBackground from "../../assets/welcome-glass-effect.png";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const SpacesPage: React.FC = () => {
  const { talkActivity } = useGlobalState();
  const navigate = useNavigate();

  return (
    <div className="spaces">
      <NavigationFooter />
      <div className="spaces__background">
        <img
          src={HomeBackground}
          alt=""
          width="100%"
          height="100%"
          className="spaces__background__img"
        />
      </div>

      <div className="spaces__content">
        {CATEGORIES.map((c) => (
          <div key={c} onClick={() => navigate(`${ROUTES.TALKS}/${c}`)}>
            <SpacesItem
              title={c}
              numberOfActiveUsers={talkActivity.get(c) || 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpacesPage;
