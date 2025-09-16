
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';
import Navbar from '@/UI/Navbar';
import { useChat } from '@/context/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const Messages: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const { chats, messages, activeChat, setActiveChat, sendMessage, unreadCount } = useChat();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If chatId is provided, set it as the active chat
    if (chatId && chatId !== activeChat?.id) {
      setActiveChat(chatId);
    }
  }, [chatId, setActiveChat, activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get messages for the active chat
  const chatMessages = activeChat 
    ? messages.filter(msg => 
        activeChat.participants.includes(msg.senderId) && 
        activeChat.participants.includes(msg.receiverId)
      ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ArrowLeft className="h-6 w-6 mr-2" onClick={() => window.history.back()} />
          Messages
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </h1>
        
        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Chat List Sidebar */}
          <div className="hidden md:block w-1/3 max-w-xs bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold">Recent Conversations</h2>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`p-3 flex items-center cursor-pointer hover:bg-gray-50 border-b ${
                    activeChat?.id === chat.id ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                      <AvatarFallback>
                        {chat.participants[1].substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="ml-3 overflow-hidden">
                    <h3 className="font-medium truncate">
                      {chat.participants[1].substring(0, 10)}
                    </h3>
                    {chat.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                      <AvatarFallback>
                        {activeChat.participants[1].substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="font-semibold">{activeChat.participants[1]}</h2>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div 
                  className="flex-1 p-4 overflow-y-auto"
                  style={{ maxHeight: 'calc(100vh - 240px)' }}
                >
                  {chatMessages.length > 0 ? (
                    <div className="space-y-4">
                      {chatMessages.map((msg, index) => {
                        const isUser = msg.senderId !== activeChat.participants[1];
                        const showDate = index === 0 || 
                          chatMessages[index-1].timestamp.toDateString() !== msg.timestamp.toDateString();
                        
                        return (
                          <React.Fragment key={msg.id}>
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <Badge variant="outline" className="bg-gray-50">
                                  {format(msg.timestamp, 'MMMM d, yyyy')}
                                </Badge>
                              </div>
                            )}
                            
                            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] ${isUser ? 'bg-primary-100 text-primary-900' : 'bg-gray-100'} rounded-lg px-4 py-2`}>
                                <p>{msg.content}</p>
                                <p className="text-xs text-gray-500 text-right mt-1">
                                  {format(msg.timestamp, 'h:mm a')}
                                </p>
                                
                                {/* If this is an order message */}
                                {msg.order && (
                                  <div className="mt-2 border-t pt-2">
                                    <p className="font-semibold text-sm">Order Details:</p>
                                    <ul className="text-sm mt-1">
                                      {msg.order.map(item => (
                                        <li key={item.id} className="flex justify-between">
                                          <span>{item.quantity}x {item.name}</span>
                                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-semibold">
                                      <span>Total</span>
                                      <span>${msg.order.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <p>No messages yet</p>
                      <p className="text-sm">Send a message to start the conversation</p>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="ml-2" disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500">
                <MessageCircle className="h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No chat selected</h2>
                <p className="text-center">
                  Select a conversation from the sidebar to view your messages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
