import { useState, useEffect } from "react";
import { Camera, Phone, Video, Send, ChevronLeft } from "lucide-react";
import chatMessages from "@/data/chatMessages.json";

export default function EngineerChat() {
  const authUser =
    JSON.parse(localStorage.getItem("authUser")) || {
      id: "eng-1",
      role: "ENGINEER",
      name: "Engineer",
    };

  const [messagesData, setMessagesData] = useState([]);
  const [input, setInput] = useState("");
  const [activeProject, setActiveProject] = useState("proj-1");
  const [showProjectList, setShowProjectList] = useState(true);

  /* ================= LOAD ================= */
  useEffect(() => {
    const stored = localStorage.getItem("chatMessages");
    if (stored) {
      setMessagesData(JSON.parse(stored));
    } else {
      localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
      setMessagesData(chatMessages);
    }
  }, []);

  /* ================= PROJECT LIST ================= */
  const projects = Object.values(
    messagesData.reduce((acc, msg) => {
      if (
        !acc[msg.projectId] ||
        new Date(msg.createdAt) > new Date(acc[msg.projectId].createdAt)
      ) {
        acc[msg.projectId] = msg;
      }
      return acc;
    }, {})
  );

  const messages = messagesData.filter(
    (m) => m.projectId === activeProject
  );

  /* ================= SEND ================= */
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      projectId: activeProject,
      projectName: messages[0]?.projectName || "Project",
      sender: {
        id: authUser.id,
        role: authUser.role,
        name: authUser.name,
      },
      receiver: { id: "owner-1", role: "OWNER", name: "Project Owner" },
      message: input,
      type: "TEXT",
      createdAt: new Date().toISOString(),
      status: "SENT",
    };

    const updated = [...messagesData, newMessage];
    setMessagesData(updated);
    localStorage.setItem("chatMessages", JSON.stringify(updated));
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-96px)] flex bg-white rounded-xl border overflow-hidden">

      {/* ============ PROJECT LIST ============ */}
      <div
        className={`${
          showProjectList ? "flex" : "hidden"
        } md:flex w-full md:w-72 border-r bg-gray-50 flex-col`}
      >
        <div className="p-3 text-sm font-bold text-gray-700 border-b bg-white">
          Project Chats
        </div>

        <div className="flex-1 overflow-y-auto">
          {projects.map((p) => (
            <div
              key={p.projectId}
              onClick={() => {
                setActiveProject(p.projectId);
                setShowProjectList(false);
              }}
              className={`px-3 py-3 cursor-pointer border-b transition
              ${
                activeProject === p.projectId
                  ? "bg-orange-100 border-l-4 border-l-orange-500"
                  : "hover:bg-orange-50"
              }`}
            >
              <p className="font-bold text-sm truncate">{p.projectName}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {p.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ CHAT AREA ============ */}
      <div
        className={`${
          showProjectList ? "hidden" : "flex"
        } md:flex flex-1 flex-col min-w-0`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-white">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setShowProjectList(true)}
              className="md:hidden text-orange-600"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
              AM
            </div>

            <div className="min-w-0">
              <p className="font-bold text-sm truncate">
                Skyline Residency
              </p>
              <p className="text-[9px] text-green-600 font-bold uppercase">
                ● Online
              </p>
            </div>
          </div>

          <div className="flex gap-2 text-orange-600 shrink-0">
            <Phone size={18} />
            <Video size={18} />
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-3 overflow-y-auto bg-slate-50 space-y-3">
          {messages.map((msg) => {
            const isMe = msg.sender.id === authUser.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] sm:max-w-[70%] px-3 py-2.5 rounded-xl text-sm shadow
                  ${
                    isMe
                      ? "bg-[#0B3C5D] text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none"
                  }`}
                >
                  {!isMe && (
                    <p className="text-[9px] font-black text-orange-600 uppercase mb-0.5">
                      {msg.sender.name}
                    </p>
                  )}
                  <p className="leading-relaxed break-words">
                    {msg.message}
                  </p>
                  <p className="text-[8px] text-right opacity-60 mt-1 font-bold">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="px-2 py-2 border-t bg-white flex items-center gap-1.5">
          <Camera size={18} className="text-orange-600 shrink-0" />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type update..."
            className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-orange-600 text-white p-2 rounded-full active:scale-90 transition"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}