import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DachboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  FileText,
  Calendar,
  MapPin
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
  caseTitle: string;
}

const ClientMessages = () => {
  const { hasRole } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Attorney Sarah Wilson',
      role: 'Assigned Lawyer',
      avatar: '/avatars/sarah-wilson.jpg',
      lastMessage: 'I\'ve reviewed your case documents and have some questions',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 1,
      isOnline: true,
      caseTitle: 'Employment Discrimination Case'
    },
    {
      id: '2',
      name: 'Legal Assistant Mike Chen',
      role: 'Case Assistant',
      avatar: '/avatars/mike-chen.jpg',
      lastMessage: 'Your court filing has been submitted successfully',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 0,
      isOnline: false,
      caseTitle: 'Employment Discrimination Case'
    },
    {
      id: '3',
      name: 'Attorney David Rodriguez',
      role: 'Senior Partner',
      avatar: '/avatars/david-rodriguez.jpg',
      lastMessage: 'We need to schedule a meeting to discuss the settlement offer',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 2,
      isOnline: true,
      caseTitle: 'Contract Dispute Resolution'
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'Attorney Sarah Wilson',
      content: 'Hello! I\'ve been assigned to your employment discrimination case. I\'ve reviewed the initial documents you provided.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
      isFromMe: false
    },
    {
      id: '2',
      sender: 'You',
      content: 'Thank you for taking my case. I\'m really concerned about the timeline and what we can expect.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      isRead: true,
      isFromMe: true
    },
    {
      id: '3',
      sender: 'Attorney Sarah Wilson',
      content: 'I understand your concerns. Based on my initial review, we have a strong case. I\'d like to schedule a consultation to discuss the strategy and timeline in detail.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
      isRead: true,
      isFromMe: false
    },
    {
      id: '4',
      sender: 'You',
      content: 'That sounds great. When would be a good time for you? I\'m available most afternoons.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true,
      isFromMe: true
    },
    {
      id: '5',
      sender: 'Attorney Sarah Wilson',
      content: 'I\'ve reviewed your case documents and have some questions about the timeline of events. Can we discuss this tomorrow at 2 PM?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
      isFromMe: false
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.caseTitle.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (!hasRole(['client'])) {
    return (
      <DashboardLayout title="Messages">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. This page is for clients only.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Messages">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Contacts Sidebar */}
        <div className="w-80 border-r bg-background">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-4">Messages</h2>
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
          
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedContact(contact)}
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
                        <span className="text-xs text-muted-foreground">
                          {contact.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.caseTitle}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
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
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                      <AvatarFallback>
                        {selectedContact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedContact.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
                      <p className="text-xs text-muted-foreground">{selectedContact.caseTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Calendar className="h-4 w-4" />
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
                      <div className={`max-w-xs lg:max-w-md ${message.isFromMe ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.isFromMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
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
              <div className="p-4 border-t bg-background">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
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
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
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
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientMessages; 