import React, { useState } from "react";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  User,
  Heart,
  Stethoscope,
  Calendar,
  ArrowLeft,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  specialty?: string;
  nextAppointment?: string;
}

interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: string;
  sender: "patient" | "healthcare";
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file";
}

const MessagingInterface: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const contacts: Contact[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      role: "Primary Care Physician",
      lastMessage: "Your test results look good. Let's schedule a follow-up.",
      timestamp: "10:30 AM",
      unreadCount: 0,
      isOnline: true,
      specialty: "Internal Medicine",
      nextAppointment: "Dec 28, 2024 - 2:00 PM",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      lastMessage: "Please remember to take your medication as prescribed.",
      timestamp: "Yesterday",
      unreadCount: 2,
      isOnline: false,
      specialty: "Cardiology",
      nextAppointment: "Jan 5, 2025 - 10:30 AM",
    },
    {
      id: "3",
      name: "Nurse Jennifer Williams",
      role: "Registered Nurse",
      lastMessage: "I've updated your appointment time. See you tomorrow!",
      timestamp: "Yesterday",
      unreadCount: 0,
      isOnline: true,
      specialty: "General Care",
      nextAppointment: "Dec 22, 2024 - 9:00 AM",
    },
    {
      id: "4",
      name: "Dr. Amanda Rodriguez",
      role: "Dermatologist",
      lastMessage: "The prescription has been sent to your pharmacy.",
      timestamp: "Dec 18",
      unreadCount: 0,
      isOnline: false,
      specialty: "Dermatology",
      nextAppointment: "Jan 15, 2025 - 3:30 PM",
    },
    {
      id: "5",
      name: "Physical Therapist Mark Davis",
      role: "Physical Therapist",
      lastMessage: "Great progress on your exercises! Keep it up.",
      timestamp: "Dec 17",
      unreadCount: 1,
      isOnline: true,
      specialty: "Physical Therapy",
      nextAppointment: "Dec 23, 2024 - 1:00 PM",
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      contactId: "1",
      content:
        "Hello Dr. Johnson, I wanted to follow up on my recent blood work results.",
      timestamp: "9:45 AM",
      sender: "patient",
      status: "read",
      type: "text",
    },
    {
      id: "2",
      contactId: "1",
      content:
        "Good morning John! I've reviewed your results and everything looks great. Your cholesterol levels have improved significantly.",
      timestamp: "10:15 AM",
      sender: "healthcare",
      status: "delivered",
      type: "text",
    },
    {
      id: "3",
      contactId: "1",
      content: "That's wonderful news! Thank you for letting me know.",
      timestamp: "10:18 AM",
      sender: "patient",
      status: "read",
      type: "text",
    },
    {
      id: "4",
      contactId: "1",
      content:
        "Your test results look good. Let's schedule a follow-up appointment to discuss your treatment plan going forward.",
      timestamp: "10:30 AM",
      sender: "healthcare",
      status: "delivered",
      type: "text",
    },
  ];

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContactData = contacts.find((c) => c.id === selectedContact);
  const contactMessages = messages.filter(
    (m) => m.contactId === selectedContact
  );

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId);
  };

  const handleBackToContacts = () => {
    setSelectedContact(null);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedContact) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", messageInput, "to:", selectedContact);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.includes("Doctor") || role.includes("Dr.")) return Stethoscope;
    if (role.includes("Nurse")) return Heart;
    if (role.includes("Therapist")) return User;
    return User;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return Clock;
      case "delivered":
        return Check;
      case "read":
        return CheckCheck;
      default:
        return Clock;
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden h-screen max-h-[800px] flex relative">
      {/* Contacts Sidebar */}
      <div
        className={`w-full md:w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col absolute md:relative inset-0 z-10 ${
          selectedContact ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 bg-green-600 text-white">
          <h1 className="text-lg font-semibold mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search healthcare providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-green-500 text-white placeholder-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => {
            const RoleIcon = getRoleIcon(contact.role);
            return (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact.id)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedContact === contact.id
                    ? "bg-green-50 border-r-4 border-r-green-600"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <RoleIcon className="w-6 h-6 text-green-600" />
                    </div>
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {contact.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-green-600 mb-1">
                      {contact.role}
                    </p>

                    <p className="text-sm text-gray-600 truncate mb-2">
                      {contact.lastMessage}
                    </p>

                    {contact.nextAppointment && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Next: {contact.nextAppointment}</span>
                      </div>
                    )}
                  </div>

                  {contact.unreadCount > 0 && (
                    <div className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {contact.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col w-full md:w-2/3 absolute md:relative inset-0 ${
          selectedContact ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedContactData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Back button for mobile */}
                <button
                  onClick={handleBackToContacts}
                  className="md:hidden p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    {React.createElement(
                      getRoleIcon(selectedContactData.role),
                      {
                        className: "w-5 h-5 text-green-600",
                      }
                    )}
                  </div>
                  {selectedContactData.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedContactData.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedContactData.isOnline
                      ? "Online"
                      : "Last seen recently"}{" "}
                    • {selectedContactData.specialty}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {contactMessages.map((message) => {
                  const StatusIcon = getStatusIcon(message.status);
                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "patient"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "patient"
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.sender === "patient"
                              ? "text-green-100"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="text-xs">{message.timestamp}</span>
                          {message.sender === "patient" && (
                            <StatusIcon className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-green-600 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className={`p-2 rounded-full transition-colors ${
                    messageInput.trim()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Contact Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Healthcare Messaging
              </h3>
              <p className="text-gray-600">
                Select a healthcare provider to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
