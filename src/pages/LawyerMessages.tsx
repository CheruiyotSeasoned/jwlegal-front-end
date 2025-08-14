import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DachboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Smile,
  User,
  Clock,
  Check,
  CheckCheck,
  ArrowLeft,
  Menu
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isFromMe: boolean;
  attachments?: string[];
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

const LawyerMessages = () => {
  const { hasRole } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showContacts, setShowContacts] = useState(true);

  // Mock data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Client',
      avatar: '/avatars/sarah.jpg',
      lastMessage: 'Thank you for the update on my case',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Client',
      avatar: '/avatars/michael.jpg',
      lastMessage: 'When can we schedule the next meeting?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Client',
      avatar: '/avatars/emily.jpg',
      lastMessage: 'I have some questions about the contract',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '4',
      name: 'David Thompson',
      role: 'Client',
      avatar: '/avatars/david.jpg',
      lastMessage: 'The documents have been signed',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      unreadCount: 0,
      isOnline: false
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'Sarah Johnson',
      content: 'Hi, I wanted to check on the status of my case',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
      isFromMe: false
    },
    {
      id: '2',
      sender: 'You',
      content: 'Hello Sarah! I\'ve been working on your case and have some good news to share',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      isRead: true,
      isFromMe: true
    },
    {
      id: '3',
      sender: 'Sarah Johnson',
      content: 'That sounds great! What\'s the latest update?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
      isRead: true,
      isFromMe: false
    },
    {
      id: '4',
      sender: 'You',
      content: 'I\'ve completed the initial review and found some favorable precedents. We should have a strong case',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true,
      isFromMe: true
    },
    {
      id: '5',
      sender: 'Sarah Johnson',
      content: 'Thank you for the update on my case',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
      isFromMe: false
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() && selectedContact) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    // On mobile, hide contacts when a contact is selected
    if (window.innerWidth < 768) {
      setShowContacts(false);
    }
  };

  const handleBackToContacts = () => {
    setShowContacts(true);
    setSelectedContact(null);
  };

  if (!hasRole(['lawyer'])) {
    return (
      <DashboardLayout title="Messages">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. This page is for lawyers only.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Messages">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Contacts Sidebar - Hidden on mobile when chat is active */}
        <div className={`${
          showContacts ? 'flex' : 'hidden'
        } md:flex flex-col w-full md:w-80 border-r bg-background`}>
          {/* Mobile Header */}
          <div className="md:hidden p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block p-4 border-b">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Contacts List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {contact.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{contact.name}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {contact.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`${
          !showContacts ? 'flex' : 'hidden'
        } md:flex flex-1 flex-col`}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Mobile Back Button */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="md:hidden"
                      onClick={handleBackToContacts}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                      <AvatarFallback>
                        {selectedContact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{selectedContact.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{selectedContact.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md ${message.isFromMe ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg px-3 py-2 sm:px-4 ${
                            message.isFromMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm break-words">{message.content}</p>
                        </div>
                        <div className={`flex items-center space-x-1 mt-1 text-xs text-muted-foreground ${
                          message.isFromMe ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {message.isFromMe && (
                            <span>
                              {message.isRead ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-3 sm:p-4 border-t bg-background">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 hidden sm:flex"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Empty State */}
        {!selectedContact && showContacts && (
          <div className="md:hidden flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">Tap on a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LawyerMessages; 