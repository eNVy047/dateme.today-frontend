import { useState,  useCallback, } from 'react';
import { useSocket } from '../hooks/useSocket';
import type { Message, SocketEventCallbacks } from '../types/socketTypes';
import { ChatContainer } from './ChatContainer';
import { WaitingScreen } from './WaitingScreen';
import { ConnectionStatus } from './ConnectionStatus';

export const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = useState(true);
  const [currentUserId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);


  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const socketCallbacks: SocketEventCallbacks = {
    onWaitingForMatch: () => {
      setIsWaiting(true);
      setIsConnected(false);
      setPartnerTyping(false);
    },
    onChatStarted: () => {
      setIsWaiting(false);
      setIsConnected(true);
      setMessages([]);
    },
    onMessageReceived: handleNewMessage,
    onPartnerLeft: () => {
      setIsWaiting(true);
      setIsConnected(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'system',
          message: 'Your partner has left the chat',
          timestamp: Date.now(),
        },
      ]);
    },
    onPartnerDisconnected: () => {
      setIsWaiting(true);
      setIsConnected(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'system',
          message: 'Your partner has disconnected',
          timestamp: Date.now(),
        },
      ]);
    },
    onPartnerTyping: (isTyping) => {
      setPartnerTyping(isTyping);
    },
    onError: (error) => {
      console.error('Socket error:', error);
    },
  };

  const socket = useSocket(socketCallbacks);

  const handleSendMessage = useCallback(
    (message: string) => {
      socket.sendMessage(message);
      handleNewMessage({
        sender: currentUserId,
        message,
        timestamp: Date.now(),
      });
      setIsTyping(false);
    },
    [socket, currentUserId, handleNewMessage]
  );

  const handleNextPartner = useCallback(() => {
    socket.requestNextPartner();
  }, [socket]);

  const handleTypingChange = useCallback(
    (typing: boolean) => {
      setIsTyping(typing);
      socket.sendTypingStatus(typing);
    },
    [socket]
  );

  return (
    <div className="h-screen bg-gray-100 p-4 md:p-8">
      <ConnectionStatus />
      
      <div className="max-w-4xl mx-auto h-full">
        {isWaiting ? (
          <WaitingScreen />
        ) : (
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            onNextPartner={handleNextPartner}
            currentUserId={currentUserId}
            isConnected={isConnected}
            isTyping={isTyping}
            partnerTyping={partnerTyping}
            onTypingChange={handleTypingChange}
          />
        )}
      </div>
    </div>
  );
};