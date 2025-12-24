import { useState, useEffect } from "react";
import { Camera, Paperclip, Phone, Video, Send, ChevronLeft } from "lucide-react";
import chatMessages from "@/data/chatMessages.json";

export default function EngineerChat() {
  const authUser = JSON.parse(localStorage.getItem("authUser")) || { id: 'eng-1', role: 'ENGINEER' };
  const [messagesData, setMessagesData] = useState([]);
  const [input, setInput] = useState("");
  const [activeProject, setActiveProject] = useState("proj-1");
  const [showProjectList, setShowProjectList] = useState(true); // Toggle for mobile

  useEffect(() => {
    const stored = localStorage.getItem("chatMessages");
    if (stored) {
      setMessagesData(JSON.parse(stored));
    } else {
      localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
      setMessagesData(chatMessages);
    }
  }, []);

  const projects = Object.values(
    messagesData.reduce((acc, msg) => {
      if (!acc[msg.projectId] || new Date(msg.createdAt) > new Date(acc[msg.projectId].createdAt)) {
        acc[msg.projectId] = msg;
      }
      return acc;
    }, {})
  );

  const messages = messagesData.filter(m => m.projectId === activeProject);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      projectId: activeProject,
      projectName: messages[0]?.projectName || "Project",
      sender: { id: authUser.id, role: authUser.role, name: authUser.name || "Engineer" },
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
    <div className="h-[calc(100vh-120px)] flex bg-white rounded-2xl border overflow-hidden relative">
      {/* LEFT: PROJECT CHAT LIST */}
      <div className={`${showProjectList ? 'flex' : 'hidden'} md:flex w-full md:w-72 border-r bg-gray-50 flex-col shrink-0`}>
        <div className="p-4 font-bold text-gray-700 border-b bg-white">Project Chats</div>
        <div className="flex-1 overflow-y-auto">
          {projects.map(p => (
            <div
              key={p.projectId}
              onClick={() => { setActiveProject(p.projectId); setShowProjectList(false); }}
              className={`px-4 py-4 cursor-pointer border-b hover:bg-orange-50 transition-colors ${activeProject === p.projectId ? "bg-orange-100 border-l-4 border-l-orange-500" : ""}`}
            >
              <p className="font-bold text-sm">{p.projectName}</p>
              <p className="text-xs text-gray-500 truncate mt-1">{p.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: CHAT AREA */}
      <div className={`${!showProjectList ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0 bg-white`}>
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowProjectList(true)} className="md:hidden p-1 -ml-1 text-orange-600"><ChevronLeft size={24} /></button>
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-sm">AM</div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">Skyline Residency Chat</p>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">● ONLINE</p>
            </div>
          </div>
          <div className="flex gap-4 text-orange-600 shrink-0">
            <Phone size={20} className="cursor-pointer" />
            <Video size={20} className="cursor-pointer" />
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
          {messages.map(msg => {
            const isMe = msg.sender.id === authUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${isMe ? "bg-[#0B3C5D] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"}`}>
                  {!isMe && <p className="text-[10px] font-black text-orange-600 uppercase mb-1">{msg.sender.name}</p>}
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className="text-[9px] text-right opacity-60 mt-1 uppercase font-bold">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="px-3 py-3 border-t bg-white flex items-center gap-2">
          <Camera className="text-orange-600 cursor-pointer shrink-0" size={20} />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type update..."
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500"
          />
          <button onClick={sendMessage} className="bg-orange-600 text-white p-2.5 rounded-full shadow-lg shadow-orange-500/30 active:scale-90 transition-transform">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}