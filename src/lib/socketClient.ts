import { io, Socket } from 'socket.io-client';
import type { SocketEventCallbacks } from '../types/socketTypes';

export class SocketClient {
  private socket: Socket;
  private callbacks: SocketEventCallbacks = {};

  constructor() {
    this.socket = io('http://localhost:3000', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket.emit('find_match');
      //console.log(this.socket.connected)
    });

   this.socket.on('waiting_for_match', () => {
    
  this.callbacks.onWaitingForMatch?.();
  console.log('Waiting for a match...');
   });


    this.socket.on('chat_started', (data) => {
      this.callbacks.onChatStarted?.(data);
    });

    this.socket.on('partner_typing', (isTyping) => {
      this.callbacks.onPartnerTyping?.(isTyping);
    });

    this.socket.on('receive_message', (data) => {
      this.callbacks.onMessageReceived?.({
        ...data,
        timestamp: Date.now(),
      });
    });

    this.socket.on('partner_left', () => {
      this.callbacks.onPartnerLeft?.();
    });

    this.socket.on('partner_disconnected', () => {
      this.callbacks.onPartnerDisconnected?.();
    });

    this.socket.on('partner_typing', (isTyping) => {
      this.callbacks.onPartnerTyping?.(isTyping);
    });

    this.socket.on('error', (error) => {
      this.callbacks.onError?.(error);
    });
  }

  registerCallbacks(callbacks: SocketEventCallbacks) {
    this.callbacks = callbacks;
  }

  sendMessage(message: string) {
    this.socket.emit('send_message', { message });
  }

  sendTypingStatus(isTyping: boolean) {
    this.socket.emit('typing', { isTyping });
  }

  requestNextPartner() {
    this.socket.emit('next');
  }

  disconnect() {
    this.socket.disconnect();
  }
}