import React from "react";
import "./Dropdown.scss";
import clsx from "clsx";
import DropdownIcon from "../icons/DropdownIcon/DropdownIcon";

interface DropdownProps {
  items: string[];
  activeItem: number;
  onClick: (index: number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ items, activeItem, onClick }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div onClick={toggleDropdown}>
      {isOpen ? <div className="dropdown__open__background"></div> : null}
      <div className={clsx("dropdown__button", { dropdown__open: isOpen })}>
        <div>
          {items[activeItem]}
          <span className="dropdown__button__subtext">{" (of 9)"}</span>
        </div>
        <DropdownIcon isDown={!isOpen} />
        {isOpen ? (
          <div className="dropdown__open__items-container">
            {items.map((item, index) => {
              return (
                <div
                  key={item}
                  className={clsx("dropdown__open__item", {
                    dropdown__open__item__active: index === activeItem,
                  })}
                  onClick={() => onClick(index)}
                >
                  {item}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dropdown;
