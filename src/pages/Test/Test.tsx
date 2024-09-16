import React from "react";
import { SwarmCommentSystem } from "solarpunk-comment-system-ui";
import { ethers } from "ethers";
import { Signer, Utils } from "@ethersphere/bee-js";
import "./Test.scss";
import NavigationFooter from "../../components/NavigationFooter/NavigationFooter";

const Test: React.FC = () => {
    // Create Wallet - this will be created outside the component
    let wallet: ethers.Wallet | null;
    const savedKey = localStorage.getItem("walletPrivKey");
    //if (savedKey) {
    wallet = new ethers.Wallet("0x5a6d2217c2a202cb9ac1cb6781cc3423ec6a276f488634bb935495f77cd7aba9")
    //} else {
    //  const tempPriv = ethers.Wallet.createRandom().privateKey;
    //  wallet = new ethers.Wallet(tempPriv);
    //  localStorage.setItem("walletPrivKey", wallet.privateKey)
    //}

    const signer: Signer = {
        address: Utils.hexToBytes(wallet.address.slice(2)),
        sign: async (data: any) => {
          return await wallet.signMessage(data);
        },
      };

    return (
        <div>
            <div id="chatContainer">
                <SwarmCommentSystem
                    stamp={"9d976f24b0956280dd62eaa050e97d2b7adae9a04f6e5921bbc56f5bb0bc1f69"} 
                    topic={"bagoytopic-3"} 
                    privateKey={wallet.privateKey}
                    signer={signer}
                    beeApiUrl={"http://161.97.125.121:1733"}
                />
            </div>
            <NavigationFooter />
        </div>
    );
};

export default Test;
