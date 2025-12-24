import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Camera, Paperclip, Phone, Video, Send } from "lucide-react";
import projects from "@/data/projects.json";
import chatSeed from "@/data/chatMessages.json";

export default function ProjectChat() {
  const { projectId } = useParams();
  const authUser = JSON.parse(localStorage.getItem("authUser")) || { id: "unknown" };
  const messagesEndRef = useRef(null);

  const project = projects.find(p => p.id === projectId);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  /* LOAD */
  useEffect(() => {
    const stored = localStorage.getItem("chatMessages");
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      localStorage.setItem("chatMessages", JSON.stringify(chatSeed));
      setMessages(chatSeed);
    }
  }, []);

  /* AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const projectMessages = messages.filter(m => m.projectId === projectId);

  /* SEND */
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      projectId: project?.id,
      projectName: project?.name,
      sender: { id: authUser.id, name: authUser.name || "Engineer" },
      receiver: { id: "owner-1", name: "Project Owner" },
      message: input,
      createdAt: new Date().toISOString(),
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem("chatMessages", JSON.stringify(updated));
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl border overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b bg-white shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs sm:text-base">
            {project?.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs sm:text-base truncate">
              {project?.name}
            </p>
            <p className="text-[9px] sm:text-xs text-green-600 font-bold uppercase">
              ● Online
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-4 text-orange-600">
          <Phone size={18} />
          <Video size={18} />
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 bg-slate-50">
        {projectMessages.map(msg => {
          const isMe = msg.sender.id === authUser.id;

          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`
                  max-w-[78%] sm:max-w-[70%]
                  px-3 py-2.5
                  rounded-xl
                  text-[12px] sm:text-sm
                  shadow-sm
                  ${isMe
                    ? "bg-[#0B3C5D] text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none border"}
                `}
              >
                {!isMe && (
                  <p className="text-[9px] font-black text-orange-600 uppercase mb-0.5">
                    {msg.sender.name}
                  </p>
                )}
                <p className="leading-snug whitespace-pre-wrap">
                  {msg.message}
                </p>
                <p className="text-[9px] text-right mt-1 opacity-60 font-bold">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="px-2.5 py-2 border-t bg-white flex items-center gap-2 shrink-0">
        <button className="p-1.5 text-orange-600">
          <Camera size={18} />
        </button>

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
          className="flex-1 bg-slate-100 rounded-full px-3 py-2 text-[12px] focus:ring-2 focus:ring-orange-500 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-orange-600 text-white p-2 rounded-full active:scale-90"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}