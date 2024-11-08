import React, { useEffect, useRef } from "react";
import "./ClaimRewardPage.scss";
import HomeBackground from "../../assets/registration-glass-effect.png";
import CopyIcon from "../../components/icons/CopyIcon/CopyIcon";
import WelcomeButton from "../../components/WelcomeButton/WelcomeButton";
import { useGlobalState } from "../../GlobalStateContext";
import { useNavigate } from "react-router-dom";
import { GIFTCODE_KEY, ROUTES } from "../../utils/constants";
import { ethers } from "ethers";
import { getPrivateKey, isUserRegistered } from "../../utils/helpers";

const ClaimRewardPage: React.FC = () => {
  const { username } = useGlobalState();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  let nonceRequested = false;

  useEffect(() => {
    const code = localStorage.getItem(GIFTCODE_KEY);
    if (code !== null && inputRef.current) {
      inputRef.current.value = code;
    } else if (!nonceRequested) {
      nonceRequested = true;
      try {
        fetch(process.env.BACKEND_API_URL + "/nonce/" + username).then((resp) =>
          resp.text().then(async (data) => {
            console.log("nonce fetched", data);
            if (isUserRegistered()) {
              const wallet = new ethers.Wallet(getPrivateKey());
              const flatSig = await wallet.signMessage(data);
              try {
                fetch(process.env.BACKEND_API_URL + "/redeem", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username: username,
                    message: data,
                    sig: flatSig,
                  }),
                }).then((resp) =>
                  resp.text().then((data) => {
                    if (inputRef.current) {
                      inputRef.current.value = data;
                      if (resp.status === 200) {
                        localStorage.setItem(GIFTCODE_KEY, data);
                      }
                    }
                  })
                );
              } catch (error) {
                console.log("error fetching redeem: ", error);
              }
            }
          })
        );
      } catch (error) {
        console.log("error fetching nonce: ", error);
      }
    }
  });

  const handleCopyClick = async () => {
    if (inputRef.current) {
      inputRef.current.select();
      await navigator.clipboard.writeText(inputRef.current.value);
    }
  };
  return (
    <div className="claim-reward">
      <div className="claim-reward__background">
        <img
          src={HomeBackground}
          alt=""
          className="claim-reward__background__img"
        />
      </div>
      <div className="claim-reward__main-content">
        <div className="claim-reward__main-content__header">
          Claim{" "}
          <span className="claim-reward__text-emphasize">Your&nbsp;Reward</span>
        </div>
        <div className="claim-reward__main-content-wrapper">
          <div className="claim-reward__main-content__content">
            <div className="claim-reward__text-box">
              This code is personalised for you only. Please save this code and
              use it as described on the previous screen.
            </div>
            <div className="claim-reward__code">
              <div className="claim-reward__code__header">Giftcode</div>
              <div className="claim-reward__code__input-wrapper">
                <input
                  type="text"
                  ref={inputRef}
                  className="claim-reward__code__input"
                />
                <CopyIcon onClick={handleCopyClick} />
              </div>
            </div>
            <div className="claim-reward__text-box">
              You will find this information in your profile from now on.
            </div>
            <div className="claim-reward__text-box">
              Available codes are limited. In case there are no more codes
              available Swarm is still awesome. Check out the magic{" "}
              <a
                href="https://github.com/ethersphere/awesome-swarm"
                className="claim-reward__text-box__link"
              >
                here!
              </a>
            </div>
          </div>
          <div className="claim-reward__bottom-buttons">
            <WelcomeButton
              type="white"
              onClick={() => {
                navigate(ROUTES.HOME);
              }}
            >
              Back
            </WelcomeButton>
            <WelcomeButton
              type="orange"
              onClick={() =>
                (window.location.href = `${window.location.origin}/DevconAgora/public/subscription.html`)
              }
            >
              Keep in touch
            </WelcomeButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimRewardPage;
