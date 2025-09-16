
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chat, Message, CartItem } from '@/types/place';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (content: string, recipientId?: string) => void;
  sendOrderMessage: (items: CartItem[], placeId: string) => void;
  unreadCount: number;
}

// Mock data for demonstration
const MOCK_CHATS: Chat[] = [
  {
    id: 'chat-1',
    participants: ['user-1', 'place-1'],
    unreadCount: 2
  },
  {
    id: 'chat-2',
    participants: ['user-1', 'place-3'],
    unreadCount: 0
  }
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    receiverId: 'place-1',
    content: 'Hi, I would like to know if you have vegetarian options?',
    timestamp: new Date(2023, 4, 10, 14, 30),
    isRead: true
  },
  {
    id: 'msg-2',
    senderId: 'place-1',
    receiverId: 'user-1',
    content: 'Yes, we have several vegetarian dishes including our pasta primavera and garden salad.',
    timestamp: new Date(2023, 4, 10, 14, 35),
    isRead: true
  },
  {
    id: 'msg-3',
    senderId: 'place-1',
    receiverId: 'user-1',
    content: 'Would you like to place an order?',
    timestamp: new Date(2023, 4, 10, 14, 36),
    isRead: false
  },
  {
    id: 'msg-4',
    senderId: 'place-1',
    receiverId: 'user-1',
    content: 'We also have a special discount today!',
    timestamp: new Date(2023, 4, 10, 14, 37),
    isRead: false
  }
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [activeChat, setActiveChatState] = useState<Chat | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const unreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const setActiveChat = (chatId: string | null) => {
    if (!chatId) {
      setActiveChatState(null);
      return;
    }
    
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setActiveChatState(chat);
      
      // Mark messages in this chat as read
      setMessages(currentMessages => 
        currentMessages.map(msg => {
          const isInThisChat = chat.participants.includes(msg.senderId) && 
                              chat.participants.includes(msg.receiverId);
          const isSentToUser = msg.receiverId === user?.id;
          
          if (isInThisChat && isSentToUser && !msg.isRead) {
            return { ...msg, isRead: true };
          }
          return msg;
        })
      );
      
      // Update unread count for this chat
      setChats(currentChats => 
        currentChats.map(c => 
          c.id === chatId ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  };

  const findOrCreateChat = (recipientId: string): string => {
    // Check if a chat already exists with this recipient
    const existingChat = chats.find(chat => 
      chat.participants.includes(user?.id || '') && 
      chat.participants.includes(recipientId)
    );
    
    if (existingChat) {
      return existingChat.id;
    }
    
    // Create a new chat
    const newChatId = `chat-${chats.length + 1}`;
    const newChat: Chat = {
      id: newChatId,
      participants: [user?.id || '', recipientId],
      unreadCount: 0
    };
    
    setChats([...chats, newChat]);
    return newChatId;
  };

  const sendMessage = (content: string, recipientId?: string) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return;
    }
    
    // If no recipient ID is provided, use the active chat
    let chatId: string;
    let actualRecipientId: string;
    
    if (recipientId) {
      chatId = findOrCreateChat(recipientId);
      actualRecipientId = recipientId;
    } else if (activeChat) {
      chatId = activeChat.id;
      actualRecipientId = activeChat.participants.find(id => id !== user.id) || '';
    } else {
      toast({
        title: "No recipient selected",
        description: "Please select a chat or specify a recipient.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new message
    const newMessage: Message = {
      id: `msg-${messages.length + 1}`,
      senderId: user.id,
      receiverId: actualRecipientId,
      content,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    
    // Update the chat's last message
    setChats(currentChats => 
      currentChats.map(chat => 
        chat.id === chatId ? { 
          ...chat, 
          lastMessage: newMessage
        } : chat
      )
    );
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
  };

  const sendOrderMessage = (items: CartItem[], placeId: string) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to place orders.",
        variant: "destructive"
      });
      return;
    }
    
    const chatId = findOrCreateChat(placeId);
    
    // Create order message
    const orderTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderContent = `I'd like to place an order for ${items.length} items, total: $${orderTotal.toFixed(2)}`;
    
    const newMessage: Message = {
      id: `msg-${messages.length + 1}`,
      senderId: user.id,
      receiverId: placeId,
      content: orderContent,
      timestamp: new Date(),
      isRead: false,
      order: items
    };
    
    setMessages([...messages, newMessage]);
    
    // Update the chat's last message
    setChats(currentChats => 
      currentChats.map(chat => 
        chat.id === chatId ? { 
          ...chat, 
          lastMessage: newMessage
        } : chat
      )
    );
    
    toast({
      title: "Order sent",
      description: "Your order has been sent to the restaurant. They will respond shortly.",
    });
  };

  return (
    <ChatContext.Provider value={{
      chats,
      activeChat,
      messages,
      setActiveChat,
      sendMessage,
      sendOrderMessage,
      unreadCount
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
