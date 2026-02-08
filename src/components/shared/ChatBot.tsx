import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const quickReplies = [
  { text: '📋 View Menu', action: 'menu' },
  { text: '⏰ Opening Hours', action: 'hours' },
  { text: '📍 Location', action: 'location' },
  { text: '📞 Call Us', action: 'phone' },
];

const botResponses: Record<string, string> = {
  menu: "You can view our full menu by clicking the 'Menu' link in the navigation, or visit /menu. We offer pizzas, kebabs, salads, and more!",
  hours: "We're open Monday-Saturday: 10:00 AM - 10:00 PM, Sunday: 12:00 PM - 9:00 PM. Check the footer for detailed hours!",
  location: "We're conveniently located in the city center. Visit our Contact page for directions and a map!",
  phone: "You can call us to place an order or ask any questions. Find our phone number in the header or footer!",
  default: "Thanks for your message! For immediate assistance, please call us or check our menu and contact pages. How else can I help you today?",
  greeting: "Hello! 👋 Welcome to Local Eats Hub. How can I assist you today? Feel free to ask about our menu, hours, or location!",
  order: "To place an order, browse our menu and add items to your cart, or call us directly for phone orders. We're here to help!",
  delivery: "We offer both dine-in and takeout services. For delivery options, please call us to check if we deliver to your area!",
  reservation: "To make a reservation, please use the 'Reserve Table' button on our homepage or call us directly. We look forward to serving you!",
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: botResponses.greeting,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      let botResponse = botResponses.default;
      
      // Simple keyword matching
      const lowerText = messageText.toLowerCase();
      if (lowerText.includes('menu')) botResponse = botResponses.menu;
      else if (lowerText.includes('hour') || lowerText.includes('open') || lowerText.includes('close')) botResponse = botResponses.hours;
      else if (lowerText.includes('location') || lowerText.includes('address') || lowerText.includes('where')) botResponse = botResponses.location;
      else if (lowerText.includes('phone') || lowerText.includes('call') || lowerText.includes('contact')) botResponse = botResponses.phone;
      else if (lowerText.includes('order')) botResponse = botResponses.order;
      else if (lowerText.includes('deliver')) botResponse = botResponses.delivery;
      else if (lowerText.includes('reserv') || lowerText.includes('book')) botResponse = botResponses.reservation;
      else if (lowerText.includes('hello') || lowerText.includes('hi')) botResponse = "Hello! How can I help you today?";

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const handleQuickReply = (action: string) => {
    const reply = quickReplies.find(r => r.action === action);
    if (reply) {
      handleSendMessage(reply.text);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg">Chat Assistant</CardTitle>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.isBot
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.isBot && (
                        <div className="flex items-center gap-2 mb-1">
                          <Bot className="h-3 w-3" />
                          <span className="text-xs font-semibold">Assistant</span>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => handleQuickReply(reply.action)}
                  >
                    {reply.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
