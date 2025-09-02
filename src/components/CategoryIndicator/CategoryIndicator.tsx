import React from "react";

import CategorySymbolIcon from "../icons/CategorySymbolIcon/CategorySymbolIcon";

import "./CategoryIndicator.scss";

interface CategoryIndicatorProps {
  name: string;
}

const CategoryIndicator: React.FC<CategoryIndicatorProps> = ({ name }) => {
  return (
    <div className="category-indicator">
      <div className="category-indicator__smybol-icon">
        <CategorySymbolIcon />
      </div>
      {name}
    </div>
  );
};

export default CategoryIndicator;
