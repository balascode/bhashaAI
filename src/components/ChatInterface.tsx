import { useState, useContext, useEffect } from "react";
import { Box, TextField, IconButton, Button, Paper, Typography } from "@mui/material";
import { Mic, Send, Lightbulb } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../contexts/ThemeContext";
import axios from "axios";

// Define valid language codes and personas
type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn';
type Persona = 'farmer' | 'developer' | 'student' | 'educated' | 'uneducated';

interface Message {
  text: string;
  sender: "user" | "ai";
}

// Translations for greetings
const greetings: Record<LanguageCode, Record<Persona, string>> = {
  en: {
    farmer: "Hello Farmer",
    developer: "Hello Software Developer",
    student: "Hello Student",
    educated: "Hello Educated Person",
    uneducated: "Hello Friend",
  },
  hi: {
    farmer: "नमस्ते किसान",
    developer: "नमस्ते सॉफ्टवेयर डेवलपर",
    student: "नमस्ते छात्र",
    educated: "नमस्ते शिक्षित व्यक्ति",
    uneducated: "नमस्ते मित्र",
  },
  ta: {
    farmer: "வணக்கம் விவசாயி",
    developer: "வணக்கம் மென்பொருள் உருவாக்குநர்",
    student: "வணக்கம் மாணவர்",
    educated: "வணakkம் படித்தவர்",
    uneducated: "வணakkம் நண்பர்",
  },
  te: {
    farmer: "హలో రైతు",
    developer: "హలో సాఫ్ట్‌వేర్ డెవలపర్",
    student: "హలో విద్యార్థి",
    educated: "హలో విద్యావంతుడు",
    uneducated: "హలో స్నేహితుడు",
  },
  bn: {
    farmer: "হ্যালো কৃষক",
    developer: "হ্যালো সফটওয়্যার ডেভেলপার",
    student: "হ্যালো ছাত্র",
    educated: "হ্যালো শিক্ষিত ব্যক্তি",
    uneducated: "হ্যালো বন্ধু",
  },
};

// Dummy responses translated into Telugu
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
    "এটি একটি আকর্ষণীয় বিষয়। আমার জ্ঞানের ভিত্তিতে আমি পরামর্শ দিব...",
    "আমি আপনাকে সাহায্য করতে পারি। এখানে আপনার জানা উচিত কিছু...",
    "মহান প্রশ্ন! উত্তরটি বিভিন্ন বিবেচনার সঙ্গে জড়িত...",
    "আমি আপনার অনুরোধটি বিশ্লেষণ করেছি এবং এখানে আমার প্রতিক্রिया...",
  ],
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
  const { mode } = useContext(ThemeContext);

  // Display greeting when persona changes
  useEffect(() => {
    if (selectedPersona) {
      const greeting = greetings[language]?.[selectedPersona as Persona] || greetings.en[selectedPersona as Persona] || "";
      if (greeting && !messages.some((msg) => msg.text === greeting && msg.sender === "ai")) {
        setMessages((prev) => [...prev, { text: greeting, sender: "ai" }]);
      }
    }
  }, [selectedPersona, language]);

  const handleVoice = () => {
    console.log("Voice input triggered");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsSending(true);
    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      console.log("Sending request:", { prompt: input, lang: language });
      const res = await axios.post("http://localhost:8000/process_prompt", {
        prompt: input,
        lang: language,
      }, {
        timeout: 10000, // Set timeout to 10 seconds
      });

      console.log("Raw response from API:", res.data);
      if (res.data.response) {
        const aiMessage: Message = {
          text: res.data.response,
          sender: "ai",
        };
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "70vh", gap: 2 }}>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: 2,
        }}
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", marginBottom: "10px" }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: msg.sender === "user" ? "#00f5ff" : "#ff4081",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Typography>{msg.text}</Typography>
              </Box>
            </motion.div>
          ))}
          {isSending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", color: "#fff" }}
            >
              {language === "te" ? "పంపిణీ చేస్తోంది..." : "Sending..."}
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={language === "te" ? "మీ సందేశాన్ని టైప్ చేయండి..." : "Type your message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={isSending}
          sx={{ "& .MuiOutlinedInput-root": { bgcolor: "rgba(255, 255, 255, 0.1)", borderRadius: 2 } }}
        />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton onClick={handleVoice} disabled={isSending} sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "#fff" }}>
            <Mic />
          </IconButton>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton onClick={() => setShowSuggestions(!showSuggestions)} disabled={isSending} sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", color: "#fff" }}>
            <Lightbulb />
          </IconButton>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="contained" onClick={handleSend} disabled={isSending} sx={{ bgcolor: "#00f5ff", color: "#fff", borderRadius: 2 }}>
            {language === "te" ? "పంపండి" : <Send />}
          </Button>
        </motion.div>
      </Box>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 2, mt: 1, bgcolor: "rgba(255, 255, 255, 0.1)" }}>
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => {
                    setInput(prompt);
                    setShowSuggestions(false);
                  }}
                  disabled={isSending}
                  sx={{ m: 1, color: "#fff", borderColor: "#00f5ff" }}
                >
                  {prompt}
                </Button>
              ))}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ChatInterface;