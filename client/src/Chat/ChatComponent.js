import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatComponent.module.css";
// import "./ChatComponent.module.css";

export default function ChatComponent(props) {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const [messageWindow, setMessageWindow] = useState(true);
  const [messageCome, setMessageCome] = useState(false);
  const chatScroll = useRef();

  useEffect(() => {
    if (props.sessionConnected) {
      const onChatSignal = (event) => {
        const data = JSON.parse(event.data);
        setMessageCome(true);
        console.log("set Message");
        setMessageList((prevMessageList) => [
          ...prevMessageList,
          {
            connectionId: event.from.connectionId,
            message: data.message,
            nickName: data.nickName,
          },
        ]);
        scrollToBottom();
      };

      props.user
        .getStreamManager()
        .stream.session.on("signal:chat", onChatSignal);
      return () => {
        props.user
          .getStreamManager()
          .stream.session.off("signal:chat", onChatSignal);
      };
    }
  }, [props.sessionConnected, props.user]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };
  const messageWindowOnOff = () => {
    setMessageWindow(prevMessageWindow => !prevMessageWindow );
    setMessageCome(false);
  };

  const handlePressKey = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (props.user && message) {
      console.log(message);
      let messageStr = message.replace(/ + (?= )/g, "");
      if (messageStr !== "" && messageStr !== " ") {
        const data = {
          message: messageStr,
          streamId: props.user.getStreamManager().stream.streamId,
          nickName: props.user.getNickname(),
        };
        console.log(props.nickName);
        props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      try {
        chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
      } catch (err) {}
    }, 20);
  };

  const styleChat = { display: props.chatDisplay };

  return (
    <>
    {messageWindow === false && (
      <button className = {messageCome === true ? styles.messageOpenSend : styles.messageOpen} onClick={messageWindowOnOff}> 열기 </button>
    )}
    {messageWindow === true &&(
    <div id="chatContainer" className={styles.chatContainer}>
      <div id="chatComponent" className={styles.chatComponent}>
        <div id="chatToolbar" className={styles.chatToolbar}>
          <button onClick={messageWindowOnOff}> 닫기 </button>
        </div>
        <div className={styles.messageWrap} ref={chatScroll}>
          {messageList.map((data, i) => (
            <div
              key={i}
              id="remoteUsers"
              className={`${styles.message} ${
                data.connectionId !== props.user.getConnectionId()
                  ? styles.left
                  : styles.right
              }`}
            >
              <div className={styles.msgDetail}>
                <div className={styles.msgContent}>
                  <span className={styles.spanTriangle} />
                  <p className={styles.text}>
                    {data.connectionId !== props.user.getConnectionId() ? (
                      <>
                        <span className={styles.nickName}>{data.nickName}</span>{" "}
                        <span className={styles.messageContent}>
                          {data.message}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={styles.messageContent}>
                          {data.message}
                        </span>{" "}
                        <span className={styles.nickName}></span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div id="messageInput" className={styles.messageInput}>
          <input
            placeholder="보낼 메세지"
            id="chatInput"
            value={message}
            onChange={handleChange}
            onKeyPress={handlePressKey}
          />
          <button
            id="sendButton"
            className={styles.sendButton}
            onClick={sendMessage}
            >
            전송
          </button>
        </div>
      </div>
    </div>
    )}
  </>
  );
}
