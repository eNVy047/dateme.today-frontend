import { useState, useEffect, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onNextPartner: () => void;
  disabled?: boolean;
  isTyping: boolean;
  onTypingChange: (isTyping: boolean) => void;
}

export const ChatInput = ({ 
  onSendMessage, 
  onNextPartner,
  disabled = false,
  isTyping,
  onTypingChange
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
 const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      onTypingChange(false);
    }
  };

  useEffect(() => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    if (message && !isTyping) {
      onTypingChange(true);
    }

    typingTimeout.current = setTimeout(() => {
      if (isTyping) {
        onTypingChange(false);
      }
    }, 2000);

    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [message, isTyping, onTypingChange]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={disabled || !message.trim()}
        >
          Send
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to disconnect and find a new partner?')) {
              onNextPartner();
            }
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={disabled}
        >
          Next
        </button>
      </div>
    </form>
  );
};