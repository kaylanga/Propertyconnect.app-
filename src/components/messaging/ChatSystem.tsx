import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import {
  PaperAirplaneIcon,
  PhotographIcon,
  DocumentIcon,
  EmojiHappyIcon,
  XIcon
} from '@heroicons/react/outline';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  read: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: Message;
  unreadCount: number;
  online: boolean;
  lastSeen?: string;
}

export const ChatSystem: React.FC = () => {
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    fetchContacts();
    initializeWebSocket();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeWebSocket = () => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:8080');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'new_message':
        handleNewMessage(data.message);
        break;
      case 'typing_status':
        handleTypingStatus(data);
        break;
      case 'read_receipt':
        handleReadReceipt(data);
        break;
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/messages/contacts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch contacts');

      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchMessages = async (contactId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/messages/${contactId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data);
      markMessagesAsRead(contactId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (contactId: string) => {
    try {
      await fetch(`/api/messages/${contactId}/read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      // Update contacts list to reflect read messages
      setContacts(contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, unreadCount: 0 }
          : contact
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (selectedContact?.id === message.senderId) {
      setMessages(prev => [...prev, message]);
    }

    // Update contacts list
    setContacts(contacts.map(contact => {
      if (contact.id === message.senderId) {
        return {
          ...contact,
          lastMessage: message,
          unreadCount: selectedContact?.id === message.senderId 
            ? 0 
            : contact.unreadCount + 1
        };
      }
      return contact;
    }));
  };

  const handleTypingStatus = (data: { userId: string; isTyping: boolean }) => {
    if (selectedContact?.id === data.userId) {
      setIsTyping(data.isTyping);
    }
  };

  const handleReadReceipt = (data: { messageId: string; userId: string }) => {
    setMessages(messages.map(message => 
      message.id === data.messageId 
        ? { ...message, read: true }
        : message
    ));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!selectedContact || (!newMessage.trim() && attachments.length === 0)) return;

    const formData = new FormData();
    formData.append('content', newMessage.trim());
    formData.append('receiverId', selectedContact.id);
    attachments.forEach(file => {
      formData.append('attachments', file);
    });

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to send message');

      const message = await response.json();
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setAttachments([]);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white rounded-lg shadow-lg">
      {/* Contacts Sidebar */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                selectedContact?.id === contact.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full"
                />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    {contact.name}
                  </h3>
                  {contact.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(contact.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">
                    {contact.lastMessage?.content || 'No messages yet'}
                  </p>
                  {contact.unreadCount > 0 && (
                    <span className="ml-2 bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <img
                src={selectedContact.avatar}
                alt={selectedContact.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedContact.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedContact.online
                    ? 'Online'
                    : `Last seen ${selectedContact.lastSeen}`}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${
                        message.senderId === selectedContact.id
                          ? 'justify-start'
                          : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.senderId === selectedContact.id
                            ? 'bg-gray-100'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                {attachment.type === 'image' ? (
                                  <img
                                    src={attachment.url}
                                    alt="attachment"
                                    className="max-w-xs rounded"
                                  />
                                ) : (
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-sm underline"
                                  >
                                    <DocumentIcon className="h-4 w-4" />
                                    <span>{attachment.name}</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                          {formatMessageTime(message.timestamp)}
                          {message.senderId !== selectedContact.id && (
                            <span className="ml-2">
                              {message.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      {selectedContact.name} is typing...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              {attachments.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-lg px-3 py-1"
                    >
                      <span className="text-sm truncate max-w-xs">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <PhotographIcon className="h-6 w-6" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <EmojiHappyIcon className="h-6 w-6" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && attachments.length === 0}
                  className="bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              Select a contact to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 