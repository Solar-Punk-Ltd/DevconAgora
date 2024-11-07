import React from "react";

interface HeartIconProps {
  color?: string;
  empty?: boolean;
  onClick: () => void;
}

const HeartIcon: React.FC<HeartIconProps> = ({ color, empty, onClick }) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {empty ? (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2991_948)">
            <rect x="4" y="2" width="32" height="32" rx="16" fill="white" />
            <rect
              x="4.5"
              y="2.5"
              width="31"
              height="31"
              rx="15.5"
              stroke={color ? color : "#8C72AE"}
            />
            <path
              d="M19.625 12.625L19.9719 13L20.3469 12.6256C21.3938 11.6053 22.8438 11.1409 24.2688 11.3781C26.4219 11.7369 28 13.6 28 15.7844V15.9656C28 17.2625 27.4625 18.5031 26.5125 19.3875L20.8656 24.6594C20.6313 24.8781 20.3219 25 20 25C19.6781 25 19.3688 24.8781 19.1344 24.6594L13.4872 19.3875C12.5384 18.5031 12 17.2625 12 15.9656V15.7844C12 13.6 13.5788 11.7369 15.7313 11.3781C17.1281 11.1409 18.6062 11.6053 19.625 12.625C19.625 12.6253 19.5969 12.625 19.625 12.625ZM19.9719 15.1219L18.5656 13.6594C17.8875 13.0088 16.925 12.7 15.9781 12.8575C14.5484 13.0959 13.5 14.3344 13.5 15.7844V15.9656C13.5 16.8469 13.8659 17.6906 14.5106 18.2906L20 23.4156L25.4906 18.2906C26.1344 17.6906 26.5 16.8469 26.5 15.9656V15.7844C26.5 14.3344 25.45 13.0959 24.0219 12.8575C23.075 12.7 22.1125 13.0088 21.4344 13.6594L19.9719 15.1219Z"
              fill={color ? color : "#8C72AE"}
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2991_948"
              x="0"
              y="0"
              width="40"
              height="40"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.137255 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2991_948"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2991_948"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      ) : (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_2991_890)">
            <rect x="4" y="2" width="32" height="32" rx="16" fill="white" />
            <rect
              x="4.5"
              y="2.5"
              width="31"
              height="31"
              rx="15.5"
              stroke={color ? color : "#8C72AE"}
            />
            <path
              d="M13.4875 19.3875L19.1344 24.6594C19.3688 24.8782 19.6781 25 20 25C20.3219 25 20.6313 24.8782 20.8656 24.6594L26.5125 19.3875C27.4625 18.5032 28 17.2625 28 15.9657V15.7844C28 13.6 26.4219 11.7375 24.2688 11.3782C22.8438 11.1407 21.3938 11.6063 20.375 12.625L20 13L19.625 12.625C18.6062 11.6063 17.1562 11.1407 15.7313 11.3782C13.5781 11.7375 12 13.6 12 15.7844V15.9657C12 17.2625 12.5375 18.5032 13.4875 19.3875Z"
              fill={color ? color : "#8C72AE"}
            />
          </g>
          <defs>
            <filter
              id="filter0_d_2991_890"
              x="0"
              y="0"
              width="40"
              height="40"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.121569 0 0 0 0 0.121569 0 0 0 0 0.137255 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2991_890"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_2991_890"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      )}
    </div>
  );
};

export default HeartIcon;
