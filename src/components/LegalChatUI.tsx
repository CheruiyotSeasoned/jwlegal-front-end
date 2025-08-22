import { useState, useRef, useEffect } from "react";

// ActionCard component
const ActionCard = ({ icon, title, onClick, type }) => {
  return (
    <button
      onClick={onClick}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left group"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
            {title}
          </h3>
        </div>
      </div>
    </button>
  );
};

// ChatInput component
const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your legal question..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
      </button>
    </div>
  );
};

// Main component
export const LegalChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef(null);

  const handleActionClick = (action) => {
    setChatStarted(true);
    const actionMessage = `You selected: ${action}`;
    setMessages((prev) => [...prev, { role: "user", content: actionMessage }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `LegalAI ready to help with "${action}". Please provide more details about what you need assistance with.` },
      ]);
    }, 300);
  };

  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    setChatStarted(true);
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    // Simulate assistant response (replace with API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `I understand you're asking about: "${message}". As a legal AI assistant, I can help provide general information, but please remember that this is not legal advice and you should consult with a qualified attorney for specific legal matters.` },
      ]);
    }, 500);
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full max-w-4xl mx-auto">
      {/* Messages Container */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-4 min-h-0 bg-white rounded-t-lg border border-b-0">
        {messages.length === 0 && chatStarted && (
          <div className="flex items-center justify-center h-32 text-gray-500">
            Starting conversation...
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === "user" 
                ? "bg-blue-100 text-blue-900 self-end ml-auto" 
                : "bg-gray-100 text-gray-900 self-start mr-auto"
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Initial Actions */}
      {!chatStarted && (
        <div className="p-4 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Legal AI Assistant</h2>
            <p className="text-sm text-gray-500">
              Get started by selecting an action or typing your legal question below.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ActionCard
              icon="✍️"
              title="Contract Analysis"
              onClick={() => handleActionClick("Contract Analysis")}
              type="code"
            />
            <ActionCard
              icon="🔍"
              title="Legal Research"
              onClick={() => handleActionClick("Legal Research")}
              type="copy"
            />
            <ActionCard
              icon="⚖️"
              title="Case Review"
              onClick={() => handleActionClick("Case Review")}
              type="copy"
            />
            <ActionCard
              icon="📋"
              title="Compliance Check"
              onClick={() => handleActionClick("Compliance Check")}
              type="copy"
            />
          </div>
        </div>
      )}

      {/* Chat Input - Always visible */}
      <div className="flex-shrink-0 p-4 border-t bg-white rounded-b-lg border border-t-0 shadow-sm">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default LegalChatUI;