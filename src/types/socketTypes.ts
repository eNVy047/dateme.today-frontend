export interface Message {
  sender: string;
  message: string;
  timestamp: number;
}

export interface ChatStartedEvent {
  roomId: string;
}

export type SocketEventCallbacks = {
  onWaitingForMatch?: () => void;
  onChatStarted?: (data: ChatStartedEvent) => void;
  onMessageReceived?: (message: Message) => void;
  onPartnerLeft?: () => void;
  onPartnerDisconnected?: () => void;
  onPartnerTyping?: (isTyping: boolean) => void;
  onError?: (error: string) => void;
};