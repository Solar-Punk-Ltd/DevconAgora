import React from "react";
import "./RecentRooms.scss";
import { Link } from "react-router-dom";
import RecentRoomsItem from "./RecentRoomsItem/RecentRoomsItem";
import { ethers } from "ethers";
import { Signer, Utils } from "@ethersphere/bee-js";
import { SwarmCommentSystem } from "solarpunk-comment-system-ui";
const RecentRooms: React.FC = () => {

  // Create Wallet - this will be created outside the component
  let wallet: ethers.Wallet | null;
  const savedKey = localStorage.getItem("walletPrivKey");
  if (savedKey) {
    wallet = new ethers.Wallet(savedKey)
  } else {
    const tempPriv = ethers.Wallet.createRandom().privateKey;
    wallet = new ethers.Wallet(tempPriv);
    localStorage.setItem("walletPrivKey", wallet.privateKey)
  }

  const signer: Signer = {
    address: Utils.hexToBytes(wallet.address.slice(2)),
    sign: async (data: any) => {
      return await wallet.signMessage(data);
    },
  };
  return (
    <div>
      <div className="recent-rooms">
        <div style={{}} className="recent-rooms__title">
          Recent rooms
        </div>
        <Link to="/recent">
          <div className="recent-rooms__all">All rooms</div>
        </Link>
      </div>
      <div>
        <RecentRoomsItem title="Layer 2s" numberOfActiveUsers={29} />
        <RecentRoomsItem title="Core protocol" numberOfActiveUsers={29} />
        <RecentRoomsItem
          title="Cypherhunk and privacy"
          numberOfActiveUsers={29}
        />
        <RecentRoomsItem
          title="Cypherhunk and privacy"
          numberOfActiveUsers={29}
        />

        <SwarmCommentSystem
          stamp={"9d976f24b0956280dd62eaa050e97d2b7adae9a04f6e5921bbc56f5bb0bc1f69"}
          topic={"bagoytopic"}
          privateKey={wallet.privateKey}
          beeApiUrl={process.env.BEE_API_URL}
          signer={signer}
      />
      </div>
    </div>
  );
};

export default RecentRooms;
