import type { Message } from '../types/socketTypes';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  partnerTyping: boolean;
}

interface GroupedMessage {
  sender: string;
  messages: Message[];
  timestamp: number;
  lastTimestamp: number;
}

export const ChatMessages = ({ 
  messages, 
  currentUserId, 
  partnerTyping 
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([]);

  useEffect(() => {
    const groups: GroupedMessage[] = [];
    let currentGroup: GroupedMessage | null = null;
    const GROUP_TIME_THRESHOLD = 5 * 60 * 1000;

    messages.forEach((message) => {
      if (
        !currentGroup ||
        currentGroup.sender !== message.sender ||
        message.timestamp - currentGroup.lastTimestamp > GROUP_TIME_THRESHOLD
      ) {
        currentGroup = {
          sender: message.sender,
          messages: [message],
          timestamp: message.timestamp,
          lastTimestamp: message.timestamp,
        };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(message);
        currentGroup.lastTimestamp = message.timestamp;
      }
    });

    setGroupedMessages(groups);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: number) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      <AnimatePresence initial={false}>
        {groupedMessages.map((group, groupIndex) => {
          const isCurrentUser = group.sender === currentUserId;
          const showDate = groupIndex === 0 || 
            formatDate(group.timestamp) !== formatDate(groupedMessages[groupIndex - 1].timestamp);

          return (
            <div key={group.timestamp} className="space-y-1">
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    {formatDate(group.timestamp)}
                  </span>
                </div>
              )}

              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                  {group.messages.map((message) => (
                    <motion.div
                      key={message.timestamp}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-lg px-4 py-2 ${
                        isCurrentUser
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p>{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </AnimatePresence>

      {partnerTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-800 rounded-full rounded-bl-none px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};