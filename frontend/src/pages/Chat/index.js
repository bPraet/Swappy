import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import { io } from "socket.io-client";
import api from "../../services/api";
import adress from "../../services/config";

import "./chat.css";
import "react-medium-image-zoom/dist/styles.css";

import { CircularProgress } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { motion } from "framer-motion";
import Zoom from "react-medium-image-zoom";

export default function Chat({ history }) {
  const [user, setUser] = useState();
  const [consignee, setConsignee] = useState();
  const [messages, setMessages] = useState();
  const { userId } = useParams();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    let reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount < 2) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }

    api
      .get("/user", { headers: { userToken: userToken } })
      .then((result) => {
        setUser(result);
      })
      .catch((err) => {
        localStorage.removeItem("userToken");
        history.push("/");
      });

    api
      .get(`/user/${userId}`, { headers: { userToken: userToken } })
      .then((result) => {
        setConsignee(result);
      })
      .catch((err) => {
        history.push("/");
      });

    api
      .get(`/messages/${userId}`, { headers: { userToken: userToken } })
      .then((result) => {
        setMessages(result);
      })
      .catch((err) => {
        history.push("/");
      });
  }, [history, userToken, userId]);

  if (user === undefined || consignee === undefined || messages === undefined)
    return <CircularProgress size="100px" />;

  const socket = io(adress);

  socket.emit("join", `${user.data._id},${userId}`);

  socket.on("onMessage", (message) => {
    const messages = document.getElementById("messages");

    if (messages) {
      let li = document.createElement("li");

      li.classList = "from";
      li.textContent = message.message;
      messages.appendChild(li);

      if (message.image !== "")
        ReactDOM.render(
          <span>
            <div className="imageChatContainer">
              <Zoom
                overlayBgColorStart="rgba(43, 45, 66, 0)"
                overlayBgColorEnd="rgba(43, 45, 66, 0.95)"
              >
                <img
                  className="imageChat"
                  src={message.image}
                  alt="imageChat"
                />
              </Zoom>
            </div>
            {message.message}
          </span>,
          li
        );

      li.scrollIntoView();
    }
  });

  socket.on("isWriting", (message) => {
    const isWriting = document.getElementById("isWriting");

    if (isWriting) {
      let id = window.setTimeout(function () {}, 0);

      while (id--) {
        window.clearTimeout(id);
      }

      isWriting.innerText = message;
      id = setTimeout(() => (isWriting.innerText = ""), 3000);
    }
  });

  const sendMessage = async (event, message, image) => {
    event.preventDefault();

    if (!message && !image) return;

    document.getElementById("imageChat").value = "";
    document.getElementById("message").value = "";

    let li = document.createElement("li");

    li.className = "to";
    li.textContent = message;
    document.getElementById("messages").appendChild(li);

    if (image) {
      if (
        image.type !== "image/jpeg" &&
        image.type !== "image/jpg" &&
        image.type !== "image/png"
      ) {
        li.textContent =
          "ERREUR: Veuillez envoyer une image de type .jpg, .jpeg ou .png !";
        li.scrollIntoView();
        return;
      } else if ((image.size / 5242880).toFixed(2) > 2) {
        li.textContent = "ERREUR: Veuillez envoyer une image de moins de 5Mo !";
        li.scrollIntoView();
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        socket.emit("emitMessage", {
          message: message,
          image: event.target.result,
        });
        ReactDOM.render(
          <span>
            <div className="imageChatContainer">
              <Zoom
                overlayBgColorStart="rgba(43, 45, 66, 0)"
                overlayBgColorEnd="rgba(43, 45, 66, 0.95)"
              >
                <img
                  className="imageChat"
                  src={event.target.result}
                  alt="imageChat"
                />
              </Zoom>
            </div>
            {message}
          </span>,
          li
        );
        await api.post(
          `/message/add`,
          {
            user: consignee.data._id,
            message: message,
            image: event.target.result,
          },
          { headers: { userToken: userToken } }
        );
      };

      document.getElementById("previewChat").style.backgroundImage = "";
      reader.readAsDataURL(image);
    } else {
      socket.emit("emitMessage", { message: message, image: "" });
      await api.post(
        `/message/add`,
        { user: consignee.data._id, message: message, image: "" },
        { headers: { userToken: userToken } }
      );
    }
    li.scrollIntoView();
  };

  const loadMessages = () => {
    const alreadySentMessages = [];

    for (const [i, message] of messages.data.entries()) {
      if (message.user1 === user.data._id) {
        if (message.image !== "")
          alreadySentMessages.push(
            <li className="to" key={i}>
              <div className="imageChatContainer">
                <Zoom
                  overlayBgColorStart="rgba(43, 45, 66, 0)"
                  overlayBgColorEnd="rgba(43, 45, 66, 0.95)"
                >
                  <img
                    src={message.image}
                    className="imageChat"
                    alt={"imageMessage" + i}
                  />
                </Zoom>
              </div>
              {message.message}
            </li>
          );
        else
          alreadySentMessages.push(
            <li className="to" key={i}>
              {message.message}
            </li>
          );
      } else {
        if (message.image !== "")
          alreadySentMessages.push(
            <li className="from" key={i}>
              <div className="imageChatContainer">
                <Zoom
                  overlayBgColorStart="rgba(43, 45, 66, 0)"
                  overlayBgColorEnd="rgba(43, 45, 66, 0.95)"
                >
                  <img
                    src={message.image}
                    className="imageChat"
                    alt={"imageMessage" + i}
                  />
                </Zoom>
              </div>
              {message.message}
            </li>
          );
        else
          alreadySentMessages.push(
            <li className="from" key={i}>
              {message.message}
            </li>
          );
      }
    }

    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 1);

    return alreadySentMessages;
  };

  return (
    <div className="chat">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div id="chatName">Conversation avec {consignee.data.pseudo}</div>
        <ul id="messages">{loadMessages()}</ul>
        <div id="previewChat"></div>
        <div id="isWriting"></div>
        <form id="form" action="">
          <label htmlFor="imageChat">
            <Add />
          </label>
          <input
            id="imageChat"
            onChange={() =>
              (document.getElementById(
                "previewChat"
              ).style.backgroundImage = `url(${URL.createObjectURL(
                document.getElementById("imageChat").files[0]
              )})`)
            }
            type="file"
            accept=".jpg, .jpeg"
          />
          <input
            id="message"
            autoComplete="off"
            onChange={() => socket.emit("isWriting", user.data.pseudo)}
          />
          <button
            onClick={(event) =>
              sendMessage(
                event,
                document.getElementById("message").value,
                document.getElementById("imageChat").files[0]
              )
            }
          >
            Envoyer
          </button>
        </form>
      </motion.div>
    </div>
  );
}
