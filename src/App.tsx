import { Container, Box, CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import LanguageSelector from "./components/LanguageSelector";
import ChatInterface from "./components/ChatInterface";
import Background3D from "./components/Background3D";

// Define valid language codes
type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn';

// Suggested prompts by language
const suggestedPromptsByLanguage: Record<LanguageCode, string[]> = {
  en: [
    "I need help starting an online business.",
    "Create a crop plan for a farmer.",
    "How to design a website?",
  ],
  hi: [
    "मुझे एक ऑनलाइन बिजनेस शुरू करने में मदद चाहिए।",
    "किसान के लिए फसल योजना बनाएं।",
    "वेबसाइट डिजाइन कैसे करें?",
  ],
  ta: [
    "ஆன்லைன் வணிகத்தைத் தொடங்க எனக்கு உதவி தேவை.",
    "விவசாயிக்கான பயிர் திட்டம் உருவாக்கவும்.",
    "வலைத்தளத்தை எவ்வாறு வடிவமைப்பது?",
  ],
  te: [
    "ఆన్‌లైన్ వ్యాపారాన్ని ప్రారంభించడానికి నాకు సహాయం కావాలి.",
    "రైతు కోసం పంట ప్రణాళికను రూపొందించండి.",
    "వెబ్‌సైట్‌ను ఎలా డిజైన్ చేయాలి?",
  ],
  bn: [
    "একটি অনলাইন ব্যবসা শুরু করতে আমার সাহায্য দরকার।",
    "কৃষকের জন্য ফসল পরিকল্পনা তৈরি করুন।",
    "ওয়েবসাইট কিভাবে ডিজাইন করবেন?",
  ],
};

// UI text translations
interface UIText {
  loadingTitle: string;
  loadingSubtitle: string;
}

const uiText: Record<LanguageCode, UIText> = {
  en: {
    loadingTitle: "BHASHA AI",
    loadingSubtitle: "Bridging language barriers with AI",
  },
  hi: {
    loadingTitle: "भाषा AI",
    loadingSubtitle: "AI के साथ भाषा बाधाओं को पाटना",
  },
  ta: {
    loadingTitle: "பாஷா AI",
    loadingSubtitle: "AI உடன் மொழித் தடைகளை இணைத்தல்",
  },
  te: {
    loadingTitle: "భాష AI",
    loadingSubtitle: "AI తో భాషా అడ్డంకులను అధిగమించడం",
  },
  bn: {
    loadingTitle: "ভাষা AI",
    loadingSubtitle: "AI এর সাথে ভাষা বাধা দূর করা",
  },
};

const App = () => {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getSuggestedPrompts = (): string[] => {
    return suggestedPromptsByLanguage[language] || suggestedPromptsByLanguage.en;
  };

  const getText = (key: keyof UIText): string => {
    return uiText[language]?.[key] || uiText.en[key];
  };

  return (
    <ThemeContextProvider>
      <CssBaseline />
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#050920",
              zIndex: 9999,
            }}
          >
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Box sx={{ fontSize: "3rem", fontWeight: "bold", color: "#00f5ff" }}>
                  {getText("loadingTitle").split("AI")[0]}
                  <span style={{ color: "#ff4081" }}>AI</span>
                </Box>
                <Box sx={{ mt: 2, color: "#ffffff", opacity: 0.8 }}>
                  {getText("loadingSubtitle")}
                </Box>
              </Box>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
          >
            <Background3D />
            <Box sx={{ position: "relative", zIndex: 1, pt: 8, pb: 8 }}>
              <Header
                language={language}
                selectedPersona={selectedPersona}
                setSelectedPersona={setSelectedPersona}
              />
              <Container maxWidth="md" sx={{ mt: 6 }}>
                <LanguageSelector language={language} setLanguage={setLanguage} />
                <ChatInterface
                  language={language}
                  suggestedPrompts={getSuggestedPrompts()}
                  selectedPersona={selectedPersona}
                />
              </Container>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeContextProvider>
  );
};

export default App;