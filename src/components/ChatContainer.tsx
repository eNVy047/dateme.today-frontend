import type { Message } from '../types/socketTypes';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onNextPartner: () => void;
  currentUserId: string;
  isConnected: boolean;
  isTyping: boolean;
  partnerTyping: boolean;
  onTypingChange: (isTyping: boolean) => void;
}

export const ChatContainer = ({
  messages,
  onSendMessage,
  onNextPartner,
  currentUserId,
  isConnected,
  isTyping,
  partnerTyping,
  onTypingChange
}: ChatContainerProps) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">
          {isConnected ? 'Chat with a stranger' : 'Disconnected'}
        </h2>
      </div>
      
      <ChatMessages 
        messages={messages} 
        currentUserId={currentUserId} 
        partnerTyping={partnerTyping} 
      />
      
      <ChatInput
        onSendMessage={onSendMessage}
        onNextPartner={onNextPartner}
        disabled={!isConnected}
        isTyping={isTyping}
        onTypingChange={onTypingChange}
      />
    </div>
  );
};