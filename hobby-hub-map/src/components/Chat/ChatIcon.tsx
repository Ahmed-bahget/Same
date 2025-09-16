
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const ChatIcon: React.FC = () => {
  const { chats, unreadCount, messages, setActiveChat } = useChat();

  const getLastMessage = (chatId: string) => {
    // Find the most recent message for this chat
    const chatMessages = messages.filter(msg => {
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return false;
      return chat.participants.includes(msg.senderId) && 
             chat.participants.includes(msg.receiverId);
    });
    
    if (chatMessages.length === 0) return null;
    
    // Sort by timestamp, newest first
    chatMessages.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
    
    return chatMessages[0];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageCircle className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Your Messages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {chats.length > 0 ? (
          <div className="max-h-60 overflow-y-auto">
            {chats.map(chat => {
              const lastMessage = getLastMessage(chat.id);
              return (
                <Link 
                  to={`/messages/${chat.id}`} 
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <DropdownMenuItem className="flex items-center py-2 px-3 cursor-pointer">
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
                    
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium truncate">
                          {chat.participants[1].substring(0, 10)}
                        </h4>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(lastMessage.timestamp, { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      {lastMessage && (
                        <p className={`text-xs truncate ${!lastMessage.isRead && 'font-medium'}`}>
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </DropdownMenuItem>
                </Link>
              );
            })}
          </div>
        ) : (
          <DropdownMenuItem disabled className="text-center py-4">
            No messages yet
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <Link to="/messages" className="block">
          <DropdownMenuItem className="text-center text-primary-600">
            See all messages
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatIcon;
