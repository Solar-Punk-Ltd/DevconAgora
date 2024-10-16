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
          <g filter="url(#filter0_d_5629_2762)">
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
              d="M19.625 12.6241L19.9719 12.9991L20.3469 12.6248C21.3938 11.6045 22.8438 11.1401 24.2688 11.3773C26.4219 11.736 28 13.5991 28 15.7835V15.9648C28 17.2616 27.4625 18.5023 26.5125 19.3866L20.8656 24.6585C20.6313 24.8773 20.3219 24.9991 20 24.9991C19.6781 24.9991 19.3688 24.8773 19.1344 24.6585L13.4872 19.3866C12.5384 18.5023 12 17.2616 12 15.9648V15.7835C12 13.5991 13.5788 11.736 15.7313 11.3773C17.1281 11.1401 18.6062 11.6045 19.625 12.6241C19.625 12.6245 19.5969 12.6241 19.625 12.6241ZM19.9719 15.121L18.5656 13.6585C17.8875 13.0079 16.925 12.6991 15.9781 12.8566C14.5484 13.0951 13.5 14.3335 13.5 15.7835V15.9648C13.5 16.846 13.8659 17.6898 14.5106 18.2898L20 23.4148L25.4906 18.2898C26.1344 17.6898 26.5 16.846 26.5 15.9648V15.7835C26.5 14.3335 25.45 13.0951 24.0219 12.8566C23.075 12.6991 22.1125 13.0079 21.4344 13.6585L19.9719 15.121Z"
              fill={color ? color : "#8C72AE"}
            />
          </g>
          <defs>
            <filter
              id="filter0_d_5629_2762"
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
                result="effect1_dropShadow_5629_2762"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_5629_2762"
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
          <g filter="url(#filter0_d_5629_959)">
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
              d="M13.4875 19.3867L19.1344 24.6586C19.3688 24.8773 19.6781 24.9992 20 24.9992C20.3219 24.9992 20.6313 24.8773 20.8656 24.6586L26.5125 19.3867C27.4625 18.5023 28 17.2617 28 15.9648V15.7836C28 13.5992 26.4219 11.7367 24.2688 11.3773C22.8438 11.1398 21.3938 11.6054 20.375 12.6242L20 12.9992L19.625 12.6242C18.6062 11.6054 17.1562 11.1398 15.7313 11.3773C13.5781 11.7367 12 13.5992 12 15.7836V15.9648C12 17.2617 12.5375 18.5023 13.4875 19.3867Z"
              fill={color ? color : "#8C72AE"}
            />
          </g>
          <defs>
            <filter
              id="filter0_d_5629_959"
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
                result="effect1_dropShadow_5629_959"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_5629_959"
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
