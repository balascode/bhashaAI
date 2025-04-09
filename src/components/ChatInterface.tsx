import { useState, useContext, useEffect, useRef } from "react";
import { Box, TextField, IconButton, Button, Paper, Typography, useMediaQuery, useTheme, CircularProgress } from "@mui/material";
import { Mic, Send, Lightbulb, KeyboardArrowDown } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../contexts/ThemeContext";
import axios from "axios";

// Define valid language codes and personas
type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn';
type Persona = 'farmer' | 'developer' | 'student' | 'educated' | 'uneducated'| 'aiArt';

interface Message {
  text: string;
  sender: "user" | "ai";
}

// map your LanguageCode to SpeechRecognition locales
const speechLocaleMap: Record<LanguageCode, string> = {
  en: "en-US",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
};

// Translations for greetings
const greetings: Record<LanguageCode, Record<Persona, string>> = {
  en: {
    farmer: "Hello Farmer",
    developer: "Hello Software Developer",
    student: "Hello Student",
    educated: "Hello Educated Person",
    uneducated: "Hello Friend",
    aiArt:"Good Day, Friend",
  },
  hi: {
    farmer: "नमस्ते किसान",
    developer: "नमस्ते सॉफ्टवेयर डेवलपर",
    student: "नमस्ते छात्र",
    educated: "नमस्ते शिक्षित व्यक्ति",
    uneducated: "नमस्ते मित्र",
    aiArt: "नमस्ते मित्र",
  },
  ta: {
    farmer: "வணக்கம் விவசாயி",
    developer: "வணakkம் மென்பொருள் உருவாக்குநர்",
    student: "வணakkம் மாணவர்",
    educated: "வணakkம் படித்தவர்",
    uneducated: "வணakkம் நண்பர்",
    aiArt: "வணakkம் நண்பர்",
  },
  te: {
    farmer: "హలో రైతు",
    developer: "హలో సాఫ్ట్‌వేర్ డెవలపర్",
    student: "హలో విద్యార్థి",
    educated: "హలో విద్యావంతుడు",
    uneducated: "హలో స్నేహితుడు",
    aiArt: "హలో స్నేహితుడు",
  },
  bn: {
    farmer: "হ্যালো কৃষক",
    developer: "হ্যালো সফটওয়্যার ডেভেলপার",
    student: "হ্যালো ছাত্র",
    educated: "হ্যালো শিক্ষিত ব্যক্তি",
    uneducated: "হ্যালো বন্ধু",
    aiArt: "হ্যালো বন্ধু",
  },
};

// Dummy responses translated into different languages
const dummyResponses: Record<LanguageCode, string[]> = {
  en: [
    "I understand your question. Let me think about that...",
    "That's an interesting point. Based on my knowledge, I would suggest...",
    "I can help you with that. Here's what you need to know...",
    "Great question! The answer involves several considerations...",
    "I've analyzed your request and here's my response...",
  ],
  hi: [
    "मैं आपका प्रश्न समझता हूँ। मुझे इसके बारे में सोचने दें...",
    "यह एक रोचक बिंदु है। मेरे ज्ञान के आधार पर, मैं सुझाव दूंगा...",
    "मैं आपकी मदद कर सकता हूँ। यहाँ आपको जो जानने की जरूरत है...",
    "शानदार सवाल! इसका जवाब कई विचारों से जुड़ा है...",
    "मैंने आपके अनुरोध का विश्लेषण किया और यहाँ मेरा जवाब है...",
  ],
  ta: [
    "உங்கள் கேள்வியை புரிந்துகொண்டேன். அதை பற்றி யோசிக்கட்டுமே...",
    "அது ஒரு சுவாரஸ்யமான புள்ளி. என் அறிவின் அடிப்படையில், நான் பரிந்துரைக்கிறேன்...",
    "நான் உங்களுக்கு உதவ முடியும். இதோ உங்களுக்கு தெரிந்திருக்க வேண்டியவை...",
    "சிறந்த கேள்வி! பதில் பல கருத்துகளை உள்ளடக்கியது...",
    "உங்கள் கோரிக்கையை ஆய்வு செய்தேன், இதோ என் பதில்...",
  ],
  te: [
    "నా భాషలో మీ ప్రశ్నను అర్థం చేసుకున్నాను. దాని గురించి ఆలోచిస్తాను...",
    "అది ఆసక్తికరమైన అంశం. నా జ్ఞానం ఆధారంగా, నేను సలహా ఇస్తాను...",
    "నేను మీకు సహాయపడతాను. ఇక్కడ మీకు తెలియవలసిన విషయాలు ఉన్నాయి...",
    "మంచి ప్రశ్న! జవాబు ఎన్నో ఆలోచనలను ఆధారంగా ఉంటుంది...",
    "మీ అభ్యర్థనను నేను విశ్లేషించాను మరియు ఇక్కడ నా స్పందన ఉంది...",
  ],
  bn: [
    "আমি আপনার প্রশ্নটি বুঝতে পেরেছি। আমাকে একটু ভাবতে দিন...",
    "এটি একটি আকর্ষণীয় বিষয়। আমার জ্ঞানের ভিত্তিতে আমি পরামর্শ দিব...",
    "আমি আপনাকে সাহায্য করতে পারি। এখানে আপনার জানা উচিত কিছু...",
    "মহান প্রশ্ন! উত্তরটি বিভিন্ন বিবেচনার সঙ্গে জড়িত...",
    "আমি আপনার অনুরোধটি বিশ্লেষণ করেছি এবং এখানে আমার প্রতিক্রিয়া...",
  ],
};

// Button labels in different languages
const buttonLabels: Record<LanguageCode, { send: string; suggestions: string; listening: string; sending: string }> = {
  en: { send: "Send", suggestions: "Suggestions", listening: "Listening...", sending: "Sending..." },
  hi: { send: "भेजें", suggestions: "सुझाव", listening: "सुन रहा हूँ...", sending: "भेज रहा हूँ..." },
  ta: { send: "அனுப்பு", suggestions: "பரிந்துரைகள்", listening: "கேட்கிறேன்...", sending: "அனுப்புகிறது..." },
  te: { send: "పంపండి", suggestions: "సూచనలు", listening: "వింటున్నాను...", sending: "పంపిణీ చేస్తోంది..." },
  bn: { send: "পাঠান", suggestions: "পরামর্শ", listening: "শুনছি...", sending: "পাঠাচ্ছে..." },
};

interface ChatInterfaceProps {
  language: LanguageCode;
  suggestedPrompts: string[];
  selectedPersona: string | null;
}

const ChatInterface = ({ language, suggestedPrompts, selectedPersona }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const { mode } = useContext(ThemeContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
    
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setHasNewMessages(false);
  };

  // Check if chat is scrolled to bottom
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      if (isAtBottom) {
        setHasNewMessages(false);
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      if (!isAtBottom && messages.length > 0) {
        setHasNewMessages(true);
      } else {
        scrollToBottom();
      }
    }
  }, [messages]);

  // Display greeting when persona changes
  useEffect(() => {
    if (selectedPersona) {
      const greeting = greetings[language]?.[selectedPersona as Persona] || greetings.en[selectedPersona as Persona] || "";
      if (greeting && !messages.some((msg) => msg.text === greeting && msg.sender === "ai")) {
        setMessages((prev) => [...prev, { text: greeting, sender: "ai" }]);
      }
    }
  }, [selectedPersona, language]);

  // Setup scrolling event listener
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => {
        chatContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
        // set up Web Speech API
        const SpeechRecognition = (window as any).SpeechRecognition
                              || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        const recog = new SpeechRecognition();
        recog.lang = speechLocaleMap[language] || "en-US";
        recog.interimResults = false;    // only final transcripts
        recog.maxAlternatives = 1;
        recog.continuous = false;            // stop after one utterance
        recog.interimResults = false;        // only final results

        // —— DEBUG LOGGING —— //
        recog.onstart      = () => console.log("[STT] recognition started");
        recog.onspeechend  = () => console.log("[STT] speech ended");
        recog.onend        = () => {
          console.log("[STT] recognition ended");
          setIsListening(false);
        };
        recog.onresult     = (e: any) => {
          console.log("[STT] result event:", e);
          const transcript = e.results[0][0].transcript;
          console.log("[STT] transcript:", transcript);
          setInput(transcript);
          handleSend();
        };
        recog.onerror      = (err: any) => console.error("[STT] error:", err.error);
        recog.onnomatch    = () => console.warn("[STT] no speech match");
// —— end DEBUG —— //
       recog.onresult = (e: any) => {
                   const transcript = e.results[0][0].transcript;
                   setInput(transcript);
                   handleSend();
               };

        recog.onend = () => setIsListening(false);
    
        recognitionRef.current = recog;
    }, [language]);
  const handleVoice = () => {
         if (!recognitionRef.current) return;
      
         if (isListening) {
           // stop if already listening
           recognitionRef.current.stop();
         } else {
           // start listening
           recognitionRef.current.start();
           setIsListening(true);
         }
       };

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsSending(true);
    console.log("Set isSending to true");
    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      console.log("Sending request:", { prompt: input, lang: language, persona: selectedPersona });
      const res = await axios.post("https://backend-basha-ai.onrender.com/process_prompt", {
        prompt: input,
        lang: language,
        persona: selectedPersona,
      });

      console.log("Raw response from API:", res.data);
      if (res.data.response) {
        const aiMessage: Message = { text: res.data.response, sender: "ai" };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        console.warn("No 'response' field in API response, showing dummy response");
        showDummyResponses();
      }
    } catch (error) {
      console.error("Error processing request:", error);
      showDummyResponses();
    } finally {
      setIsSending(false);
      console.log("Set isSending to false");
    }
  };

  const showDummyResponses = () => {
    const responses = dummyResponses[language] || dummyResponses.en;
    const randomIndex = Math.floor(Math.random() * responses.length);
    const dummyResponse = responses[randomIndex];

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: dummyResponse, sender: "ai" },
      ]);
    }, 1000);
  };

  const getPlaceholderText = () => {
    const placeholders: Record<LanguageCode, string> = {
      en: "Type your message...",
      hi: "अपना संदेश लिखें...",
      ta: "உங்கள் செய்தியை உள்ளிடவும்...",
      te: "మీ సందేశాన్ని టైప్ చేయండి...",
      bn: "আপনার বার্তা টাইপ করুন...",
    };

    return placeholders[language] || placeholders.en;
  };

  // Debug render log
  console.log("Rendering ChatInterface, isSending:", isSending);

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      height: { xs: "calc(100vh - 180px)", sm: "calc(100vh - 150px)", md: "70vh" }, 
      gap: 2,
      px: { xs: 1, sm: 2, md: 0 },
      width: "100%",
      maxWidth: "100%",
    }}>
      <Paper
        elevation={3}
        ref={chatContainerRef}
        sx={{
          flex: 1,
          p: { xs: 1, sm: 2 },
          overflowY: "auto",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 2,
          position: "relative",
        }}
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ 
                display: "flex", 
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", 
                marginBottom: "10px" 
              }}
            >
              <Box
                sx={{
                  maxWidth: { xs: "85%", sm: "75%", md: "70%" },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  bgcolor: msg.sender === "user" ? "#00f5ff" : "#ff4081",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  wordBreak: "break-word",
                }}
              >
                <Typography variant={isMobile ? "body2" : "body1"}>{msg.text}</Typography>
              </Box>
            </motion.div>
          ))}
          {isSending && (
            <motion.div
              key="sending-indicator" // Unique key to force remount
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} // Ensure it exits
              transition={{ duration: 0.2 }} // Quick exit transition
              style={{ textAlign: "center", padding: "10px" }}
            >
              <CircularProgress size={24} sx={{ color: mode === 'dark' ? '#00f5ff' : '#6200ea' }} />
              <Typography variant="body2" sx={{ mt: 1, color: mode === 'dark' ? '#00f5ff' : '#6200ea' }}>
                {buttonLabels[language]?.sending || "Sending..."}
              </Typography>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
        
        {/* Scroll to bottom button */}
        <AnimatePresence>
          {hasNewMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={scrollToBottom}
                startIcon={<KeyboardArrowDown />}
                sx={{
                  bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.8)' : 'rgba(98, 0, 234, 0.8)',
                  borderRadius: 4,
                  boxShadow: mode === 'dark' ? '0 0 15px rgba(0, 245, 255, 0.5)' : '0 0 15px rgba(98, 0, 234, 0.5)',
                  '&:hover': {
                    bgcolor: mode === 'dark' ? '#00f5ff' : '#6200ea',
                  },
                }}
              >
                New messages
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={getPlaceholderText()}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={isSending || isListening}
          size={isMobile ? "small" : "medium"}
          sx={{ 
            "& .MuiOutlinedInput-root": { 
              bgcolor: "rgba(255, 255, 255, 0.1)", 
              borderRadius: 2,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }
          }}
        />
        
        <Box sx={{ 
          display: "flex", 
          gap: 1, 
          alignItems: "center",
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          mt: { xs: 1, sm: 0 }
        }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton 
              onClick={handleVoice} 
              disabled={isSending} 
              sx={{ 
                bgcolor: isListening ? "rgba(255, 64, 129, 0.3)" : "rgba(255, 255, 255, 0.2)", 
                color: "#fff",
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 }
              }}
            >
              <Mic fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton 
              onClick={() => setShowSuggestions(!showSuggestions)} 
              disabled={isSending} 
              sx={{ 
                bgcolor: showSuggestions ? "rgba(255, 64, 129, 0.3)" : "rgba(255, 255, 255, 0.2)", 
                color: "#fff",
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 }
              }}
            >
              <Lightbulb fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              startIcon={<Send fontSize={isMobile ? "small" : "medium"} />}
              size={isMobile ? "small" : "medium"}
              sx={{
                bgcolor: mode === 'dark' ? '#00f5ff' : '#6200ea',
                color: '#fff',
                '&:hover': {
                  bgcolor: mode === 'dark' ? '#00d7df' : '#5000d3',
                },
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 0.8, sm: 1 },
              }}
            >
              {buttonLabels[language]?.send || "Send"}
            </Button>
          </motion.div>
        </Box>
      </Box>

      {/* Suggestions panel */}
      <AnimatePresence>
        {showSuggestions && suggestedPrompts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mt: 1,
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: 2,
                maxHeight: '150px',
                overflowY: 'auto'
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: mode === 'dark' ? '#00f5ff' : '#6200ea' }}>
                {buttonLabels[language]?.suggestions || "Suggestions"}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setInput(prompt);
                      setShowSuggestions(false);
                    }}
                    sx={{
                      borderColor: mode === 'dark' ? 'rgba(0, 245, 255, 0.5)' : 'rgba(98, 0, 234, 0.5)',
                      color: mode === 'dark' ? '#00f5ff' : '#6200ea',
                      '&:hover': {
                        borderColor: mode === 'dark' ? '#00f5ff' : '#6200ea',
                        bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(98, 0, 234, 0.1)',
                      },
                      textTransform: 'none',
                      borderRadius: 4,
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.85rem' }
                    }}
                  >
                    {prompt.length > (isTablet ? 30 : 50) ? prompt.substring(0, isTablet ? 30 : 50) + '...' : prompt}
                  </Button>
                ))}
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice input status */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mt: 1,
                bgcolor: "rgba(255, 64, 129, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 64, 129, 0.3)",
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}
            >
              <CircularProgress size={24} sx={{ color: '#ff4081' }} />
              <Typography variant="body1" sx={{ color: '#ff4081' }}>
                {buttonLabels[language]?.listening || "Listening..."}
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ChatInterface;