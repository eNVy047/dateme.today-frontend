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
  const typingTimeout = useRef<number | null>(null); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      // Clear any pending typing timeout
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
        typingTimeout.current = null;
      }
      onTypingChange(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // Clear existing timeout if any
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    
    // Determine typing status based on input
    const currentlyTyping = newValue.length > 0;
    
    // Update typing status if changed
    if (currentlyTyping !== isTyping) {
      onTypingChange(currentlyTyping);
    }
    
    // Set timeout to reset typing status after pause
    if (currentlyTyping) {
      typingTimeout.current = setTimeout(() => {
        onTypingChange(false);
        typingTimeout.current = null;
      }, 2000);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleChange}  // Using handleChange here
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