import React, { useEffect, useState } from 'react';
import "./Chat.scss"
import { EthAddress, EVENTS, MessageData, SwarmChat } from 'swarm-decentralized-chat';
import NavigationFooter from '../../components/NavigationFooter/NavigationFooter';
import AgendaItem from '../../components/AgendaItem/AgendaItem';
import Back from '../../components/Back/Back';
import Messages from '../../components/Messages/Messages';
import ChatInput from '../../components/ChatInput/ChatInput';
import { Wallet } from 'ethers';
import { BatchId } from '@ethersphere/bee-js';

interface ChatProps {
  topic: string;
  privKey: string;
  stamp: BatchId;
  nickname: string;
  gsocResourceId: string;
}

const GATEWAY = "86d2154575a43f3bf9922d9c52f0a63daca1cf352d57ef2b5027e38bc8d8f272";


const Chat: React.FC<ChatProps> = ({
    topic,
    privKey,
    stamp,
    nickname,
    gsocResourceId
}) => {
  const [chat, setChat] = useState<SwarmChat|null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const wallet = new Wallet(privKey);
  const ownAddress = wallet.address as EthAddress;


  const init = async () => { console.log("chat: ", chat)
    // Initialize the SwarmDecentralizedChat library
    const newChat = new SwarmChat({
      url: process.env.BEE_API_URL,
      gateway: GATEWAY,
      gsocResourceId,
      logLevel: "info", 
      usersFeedTimeout: 10000,
      messageCheckInterval: 2000,
      messageFetchMin: 2000,
      //  prettier: undefined
    });
    //setChat(newChat)

    // Start polling messages & the Users feed
    newChat.startMessageFetchProcess(topic);
    newChat.startUserFetchProcess(topic);

    // Connect to chat
    await newChat.registerUser(topic, { participant: ownAddress, key: privKey, stamp, nickName: nickname })
      .then(() => console.info(`user registered.`))
      .catch((err) => console.error(`registerUser error ${err.error}`));

    // Load users (first time when entering app)
    await newChat.initUsers(topic)
      .then(() => console.info(`initUsers was successful`))
      .catch((err) => console.error(`initUsers error: ${err.error}`));

      const { on } = newChat.getChatActions();
      on(EVENTS.RECEIVE_MESSAGE, (data) => setMessages(data)/*handleReceiveMessage*/);

      setChat(() => {return newChat})
  }

  useEffect(() => {
    init();

    return () => {
      chat?.stopMessageFetchProcess();
      chat?.stopUserFetchProcess();
    }
  }, []);


  return (
    <div className="chat-page">
      <Back 
        where={"Home"}
        link={"/home-"}
      />

      <AgendaItem 
        title="Ethereum for the next billion: DeFi for the unbanked/underbanked"
        startDate="9:00 AM"
        endDate="10:15 AM"
        hearted={true}
        category="Layer 2s"
      />

      <Messages 
        messages={
          [
            {
              address: wallet.address as EthAddress,
              message: "Hello",
              username: "Peter",
              timestamp: 1727084764586
            },
            {
              address: wallet.address as EthAddress,
              message: "Az övesállatok vagy más néven tatuk a vendégízületesek (Xenarthra) öregrendjébe tartozó emlősök egyik családja. (Ebben a rendszerezésben a páncélosok rendjébe tartoznak.) A család kilenc nemet és huszonegy recens fajt számlál, ezek legkisebbike 85 grammos, legnagyobbika 54 kg-os. Fajai Észak- és Dél-Amerikában élnek Kanada kivételével.",
              username: "Alice",
              timestamp: 1727084859617
            },
            {
              address: wallet.address as EthAddress,
              message: "A tatuk háta páncéllal fedett, melyet középen mozgatható övekbe rendezett, máshol mozgathatatlan csonttáblácskák alkotnak. Az övek száma fajra jellemző tulajdonság. Ha veszélyt éreznek, összegömbölyödnek, áthatolhatatlan bőrcsont-páncélt mutatva a támadónak.",
              username: "Alice",
              timestamp: 1727084859617
            },
            {
              address: wallet.address as EthAddress,
              message: "Nappal föld alatti üregekben tartózkodnak, éjjel keresnek táplálékot, mely elsősorban hangyákból és termeszekből áll, de nem vetik meg a döghúst és a gyümölcsöt sem. A hangyákkal táplálkozó állatokra jellemző lapos fejformájuk, hosszú alsó állkapcsuk és hosszú nyelvük van. Szemfoga egyik fajnak sincs, sok fajnál a metszőfogak is hiányoznak.",
              username: "Alice",
              timestamp: 1727084859617
            }
          ]
        }
      />
        
      {chat ? (
        <ChatInput 
        chat={chat}
        ownAddress={ownAddress}
        nickname={nickname}
        topic={topic}
        stamp={stamp}
        privKey={privKey}
      />
      ) : (
        <p>Connecting...</p>
      )}
      
      <NavigationFooter />
    </div>
  );
}

export default Chat;