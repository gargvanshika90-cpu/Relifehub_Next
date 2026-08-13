"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { useEffect, useMemo, useState } from "react";
import {
  Send,
  Search,
  MessageCircle,
  User,
  MoreVertical,
  CheckCheck,
  Clock,
  Package,
} from "lucide-react";

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [search, setSearch] = useState("");

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    loadMessages();

    const handleMessagesChanged = () => {
      loadMessages();
    };

    window.addEventListener(
      "messagesChanged",
      handleMessagesChanged
    );

    window.addEventListener(
      "requestsChanged",
      handleMessagesChanged
    );

    return () => {
      window.removeEventListener(
        "messagesChanged",
        handleMessagesChanged
      );

      window.removeEventListener(
        "requestsChanged",
        handleMessagesChanged
      );
    };
  }, []);

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  const loadMessages = () => {
    try {
      const user =
        JSON.parse(
          localStorage.getItem("user")
        ) || null;

      const savedMessages =
        JSON.parse(
          localStorage.getItem("messages")
        ) || [];

      const savedRequests =
        JSON.parse(
          localStorage.getItem("donationRequests")
        ) || [];

      if (!user) {
        setCurrentUser(null);
        return;
      }

      setCurrentUser(user);

      // =================================================
      // CREATE USER LIST FROM MESSAGES
      // =================================================

      const userMap = {};

      savedMessages.forEach((message) => {
        const currentId = String(
          user.id || user.email
        );

        const senderId = String(
          message.senderId ||
            message.senderEmail
        );

        const receiverId = String(
          message.receiverId ||
            message.receiverEmail
        );

        let otherUser = null;

        if (senderId === currentId) {
          otherUser = {
            id:
              message.receiverId ||
              message.receiverEmail,

            email:
              message.receiverEmail,

            name:
              message.receiverName ||
              "User",

            image:
              message.receiverImage ||
              null,
          };
        }

        if (receiverId === currentId) {
          otherUser = {
            id:
              message.senderId ||
              message.senderEmail,

            email:
              message.senderEmail,

            name:
              message.senderName ||
              "User",

            image:
              message.senderImage ||
              null,
          };
        }

        if (!otherUser) return;

        const key = String(
          otherUser.id ||
            otherUser.email
        );

        if (!userMap[key]) {
          userMap[key] = {
            ...otherUser,
            lastMessage:
              message.text || "",
            lastTime:
              message.createdAt ||
              new Date().toISOString(),
            unread: 0,
          };
        }

        // Latest message
        const existingTime = new Date(
          userMap[key].lastTime
        ).getTime();

        const currentTime = new Date(
          message.createdAt
        ).getTime();

        if (currentTime >= existingTime) {
          userMap[key].lastMessage =
            message.text || "";

          userMap[key].lastTime =
            message.createdAt ||
            new Date().toISOString();
        }

        // Unread
        if (
          receiverId === currentId &&
          message.read !== true
        ) {
          userMap[key].unread++;
        }
      });

      // =================================================
      // ALSO CREATE USERS FROM DONATION REQUESTS
      // =================================================

      savedRequests.forEach((request) => {
        const currentId = String(
          user.id || user.email
        );

        const donorId = String(
          request.donorId ||
            request.donorEmail ||
            ""
        );

        const requesterId = String(
          request.requesterId ||
            request.requesterEmail ||
            ""
        );

        let otherUser = null;

        // Current user is donor
        if (donorId === currentId) {
          otherUser = {
            id:
              request.requesterId ||
              request.requesterEmail,

            email:
              request.requesterEmail,

            name:
              request.requesterName ||
              request.buyerName ||
              "Buyer",

            image:
              request.requesterImage ||
              null,
          };
        }

        // Current user is buyer
        if (requesterId === currentId) {
          otherUser = {
            id:
              request.donorId ||
              request.donorEmail,

            email:
              request.donorEmail,

            name:
              request.donorName ||
              "Donor",

            image:
              request.donorImage ||
              null,
          };
        }

        if (!otherUser) return;

        const key = String(
          otherUser.id ||
            otherUser.email
        );

        if (!userMap[key]) {
          userMap[key] = {
            ...otherUser,

            lastMessage:
              request.status === "Approved"
                ? "Your donation request was approved."
                : "Donation request",

            lastTime:
              request.updatedAt ||
              request.createdAt ||
              new Date().toISOString(),

            unread: 0,
          };
        }
      });

      const finalUsers = Object.values(
        userMap
      ).sort(
        (a, b) =>
          new Date(b.lastTime) -
          new Date(a.lastTime)
      );

      setConversations(finalUsers);

      // Select first conversation
      if (
        !selectedUser &&
        finalUsers.length > 0
      ) {
        setSelectedUser(finalUsers[0]);
      }
    } catch (error) {
      console.error(
        "Error loading messages:",
        error
      );
    }
  };

  // =====================================================
  // LOAD SELECTED CONVERSATION
  // =====================================================

  useEffect(() => {
    if (!selectedUser || !currentUser) {
      setMessages([]);
      return;
    }

    const savedMessages =
      JSON.parse(
        localStorage.getItem("messages")
      ) || [];

    const currentId = String(
      currentUser.id ||
        currentUser.email
    );

    const otherId = String(
      selectedUser.id ||
        selectedUser.email
    );

    const conversation =
      savedMessages.filter((message) => {
        const senderId = String(
          message.senderId ||
            message.senderEmail
        );

        const receiverId = String(
          message.receiverId ||
            message.receiverEmail
        );

        return (
          (senderId === currentId &&
            receiverId === otherId) ||
          (senderId === otherId &&
            receiverId === currentId)
        );
      });

    setMessages(
      conversation.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      )
    );

    // Mark received messages as read
    const updatedMessages =
      savedMessages.map((message) => {
        const receiverId = String(
          message.receiverId ||
            message.receiverEmail
        );

        const senderId = String(
          message.senderId ||
            message.senderEmail
        );

        if (
          receiverId === currentId &&
          senderId === otherId
        ) {
          return {
            ...message,
            read: true,
          };
        }

        return message;
      });

    localStorage.setItem(
      "messages",
      JSON.stringify(updatedMessages)
    );

    setConversations((prev) =>
      prev.map((conversation) => {
        const conversationId =
          String(
            conversation.id ||
              conversation.email
          );

        if (
          conversationId === otherId
        ) {
          return {
            ...conversation,
            unread: 0,
          };
        }

        return conversation;
      })
    );
  }, [selectedUser, currentUser]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = () => {
    if (
      !messageText.trim() ||
      !currentUser ||
      !selectedUser
    ) {
      return;
    }

    const savedMessages =
      JSON.parse(
        localStorage.getItem("messages")
      ) || [];

    const senderId =
      currentUser.id ||
      currentUser.email;

    const receiverId =
      selectedUser.id ||
      selectedUser.email;

    const senderName = `${currentUser.firstName || currentUser.name || ""} ${
      currentUser.lastName || ""
    }`.trim();

    const newMessage = {
      id: Date.now(),

      senderId: senderId,
      senderEmail:
        currentUser.email,

      senderName:
        senderName || "User",

      senderImage:
        currentUser.image || null,

      receiverId: receiverId,
      receiverEmail:
        selectedUser.email,

      receiverName:
        selectedUser.name,

      receiverImage:
        selectedUser.image || null,

      text: messageText.trim(),

      createdAt:
        new Date().toISOString(),

      read: false,
    };

    const updatedMessages = [
      ...savedMessages,
      newMessage,
    ];

    localStorage.setItem(
      "messages",
      JSON.stringify(updatedMessages)
    );

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

    setMessageText("");

    // Update conversation preview
    setConversations((prev) =>
      prev.map((conversation) => {
        const id = String(
          conversation.id ||
            conversation.email
        );

        if (
          id === String(receiverId)
        ) {
          return {
            ...conversation,
            lastMessage:
              newMessage.text,
            lastTime:
              newMessage.createdAt,
          };
        }

        return conversation;
      })
    );

    window.dispatchEvent(
      new Event("messagesChanged")
    );
  };

  // =====================================================
  // ENTER TO SEND
  // =====================================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // FILTER CONVERSATIONS
  // =====================================================

  const filteredConversations =
    conversations.filter(
      (conversation) =>
        conversation.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // =====================================================
  // CURRENT USER NAME
  // =====================================================

  const currentUserName =
    `${currentUser?.firstName || currentUser?.name || ""} ${
      currentUser?.lastName || ""
    }`.trim() || "User";

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Sidebar />

      <main className="ml-64 min-h-screen bg-slate-50 p-6">

        <div className="max-w-7xl mx-auto">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-6">

            <h1 className="text-3xl font-bold text-gray-900">
              Messages
            </h1>

            <p className="text-gray-500 mt-1">
              Chat with donors, buyers and other
              ReLife Hub users.
            </p>

          </div>

          {/* =================================================
              MESSAGE BOX
          ================================================= */}

          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden h-[680px] flex">

            {/* =================================================
                LEFT CONVERSATIONS
            ================================================= */}

            <div className="w-[340px] border-r border-gray-200 flex flex-col">

              {/* Header */}

              <div className="p-5 border-b">

                <div className="flex items-center justify-between mb-4">

                  <h2 className="text-lg font-bold">
                    Conversations
                  </h2>

                  <MessageCircle
                    size={20}
                    className="text-green-600"
                  />

                </div>

                {/* Search */}

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search people..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-200"
                  />

                </div>

              </div>

              {/* Conversations */}

              <div className="flex-1 overflow-y-auto">

                {filteredConversations.length ===
                0 ? (

                  <div className="p-8 text-center">

                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">

                      <MessageCircle
                        size={25}
                        className="text-gray-400"
                      />

                    </div>

                    <p className="font-semibold mt-4">
                      No conversations
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Your messages will appear
                      here.
                    </p>

                  </div>

                ) : (

                  filteredConversations.map(
                    (conversation) => {

                      const isSelected =
                        selectedUser &&
                        String(
                          selectedUser.id ||
                            selectedUser.email
                        ) ===
                          String(
                            conversation.id ||
                              conversation.email
                          );

                      return (
                        <button
                          key={
                            conversation.id ||
                            conversation.email
                          }
                          onClick={() =>
                            setSelectedUser(
                              conversation
                            )
                          }
                          className={`w-full text-left p-4 border-b border-gray-100 transition ${
                            isSelected
                              ? "bg-green-50"
                              : "hover:bg-gray-50"
                          }`}
                        >

                          <div className="flex gap-3">

                            {/* Avatar */}

                            <div className="relative">

                              <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">

                                {conversation.image ? (
                                  <img
                                    src={
                                      conversation.image
                                    }
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User
                                    size={20}
                                    className="text-green-700"
                                  />
                                )}

                              </div>

                              {conversation.unread >
                                0 && (
                                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-green-600 text-white text-[10px] flex items-center justify-center">
                                  {
                                    conversation.unread
                                  }
                                </span>
                              )}

                            </div>

                            {/* Conversation info */}

                            <div className="flex-1 min-w-0">

                              <div className="flex justify-between gap-2">

                                <p className="font-semibold text-gray-900 truncate">
                                  {
                                    conversation.name
                                  }
                                </p>

                                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                                  {formatTime(
                                    conversation.lastTime
                                  )}
                                </span>

                              </div>

                              <p
                                className={`text-sm truncate mt-1 ${
                                  conversation.unread >
                                  0
                                    ? "font-semibold text-gray-700"
                                    : "text-gray-500"
                                }`}
                              >
                                {
                                  conversation.lastMessage
                                }
                              </p>

                            </div>

                          </div>

                        </button>
                      );
                    }
                  )

                )}

              </div>

            </div>

            {/* =================================================
                RIGHT CHAT
            ================================================= */}

            <div className="flex-1 flex flex-col">

              {!selectedUser ? (

                <div className="flex-1 flex items-center justify-center">

                  <div className="text-center">

                    <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center mx-auto">

                      <MessageCircle
                        size={35}
                        className="text-green-600"
                      />

                    </div>

                    <h2 className="text-xl font-bold mt-5">
                      Select a conversation
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Choose someone from the left
                      to start chatting.
                    </p>

                  </div>

                </div>

              ) : (

                <>
                  {/* =================================================
                      CHAT HEADER
                  ================================================= */}

                  <div className="h-[82px] border-b flex items-center justify-between px-6">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">

                        {selectedUser.image ? (
                          <img
                            src={
                              selectedUser.image
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User
                            size={20}
                            className="text-green-700"
                          />
                        )}

                      </div>

                      <div>

                        <h2 className="font-bold text-gray-900">
                          {selectedUser.name}
                        </h2>

                        <p className="text-xs text-green-600">
                          ReLife Hub member
                        </p>

                      </div>

                    </div>

                    <button className="p-2 rounded-xl hover:bg-gray-100">
                      <MoreVertical
                        size={20}
                        className="text-gray-500"
                      />
                    </button>

                  </div>

                  {/* =================================================
                      CHAT MESSAGES
                  ================================================= */}

                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

                    {messages.length ===
                    0 ? (

                      <div className="h-full flex items-center justify-center">

                        <div className="text-center">

                          <div className="w-14 h-14 rounded-2xl bg-white border flex items-center justify-center mx-auto">

                            <MessageCircle
                              size={24}
                              className="text-green-600"
                            />

                          </div>

                          <p className="font-semibold mt-4">
                            Start a conversation
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Send a message to{" "}
                            {selectedUser.name}.
                          </p>

                        </div>

                      </div>

                    ) : (

                      <div className="space-y-4">

                        {messages.map(
                          (message) => {

                            const isMine =
                              String(
                                message.senderId ||
                                  message.senderEmail
                              ) ===
                              String(
                                currentUser.id ||
                                  currentUser.email
                              );

                            return (
                              <div
                                key={
                                  message.id
                                }
                                className={`flex ${
                                  isMine
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >

                                <div
                                  className={`max-w-[65%] ${
                                    isMine
                                      ? "items-end"
                                      : "items-start"
                                  }`}
                                >

                                  <div
                                    className={`px-4 py-3 rounded-2xl text-sm ${
                                      isMine
                                        ? "bg-green-700 text-white rounded-br-md"
                                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                                    }`}
                                  >
                                    {
                                      message.text
                                    }
                                  </div>

                                  <div
                                    className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 ${
                                      isMine
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                                  >

                                    {formatTime(
                                      message.createdAt
                                    )}

                                    {isMine && (
                                      <CheckCheck
                                        size={
                                          13
                                        }
                                        className="text-green-600"
                                      />
                                    )}

                                  </div>

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    )}

                  </div>

                  {/* =================================================
                      MESSAGE INPUT
                  ================================================= */}

                  <div className="p-4 border-t bg-white">

                    <div className="flex items-center gap-3">

                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(
                            e.target.value
                          )
                        }
                        onKeyDown={
                          handleKeyDown
                        }
                        placeholder="Type a message..."
                        className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                      />

                      <button
                        onClick={sendMessage}
                        disabled={
                          !messageText.trim()
                        }
                        className="w-12 h-12 rounded-2xl bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
                      >
                        <Send size={19} />
                      </button>

                    </div>

                    <p className="text-[11px] text-gray-400 mt-2 ml-2">
                      Press Enter to send
                    </p>

                  </div>

                </>

              )}

            </div>

          </div>

        </div>

      </main>
    </>
  );
}