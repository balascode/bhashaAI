import { TextField, Button, IconButton, Box, Paper } from "@mui/material";
import { Mic, Send, Lightbulb } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import axios from "axios";

// Inline type definitions (move to src/types.d.ts if shared across files)
interface SpeechRecognitionResult {
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResult[];
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const PromptInput = ({
  onSubmit,
  language,
  suggestedPrompts,
}: {
  onSubmit: (response: string) => void;
  language: string;
  suggestedPrompts: string[];
}) => {
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { mode } = useContext(ThemeContext);

  const handleVoice = () => {
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    setIsListening(true);

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = `${language}-IN`;

    recognition.onresult = (event) => {
      setPrompt(event.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (promptText: string) => {
    if (!promptText.trim()) return;

    try {
      const res = await axios.post("http://localhost:8000/process_prompt", {
        prompt: promptText,
        lang: language,
      });
      onSubmit(res.data.response);
      setPrompt("");
    } catch (error) {
      console.error("Error processing prompt:", error);
    }
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: mode === "dark" ? "rgba(10, 16, 41, 0.6)" : "rgba(255, 255, 255, 0.9)",
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={handleVoice}
                color="primary"
                sx={{
                  bgcolor: mode === "dark" ? "rgba(0, 245, 255, 0.1)" : "rgba(98, 0, 234, 0.1)",
                  "&:hover": {
                    bgcolor: mode === "dark" ? "rgba(0, 245, 255, 0.2)" : "rgba(98, 0, 234, 0.2)",
                  },
                  boxShadow: isListening
                    ? mode === "dark"
                      ? "0 0 15px #00f5ff, 0 0 30px #00f5ff"
                      : "0 0 15px #6200ea"
                    : "none",
                  animation: isListening ? "pulse 1.5s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { boxShadow: mode === "dark" ? "0 0 5px #00f5ff" : "0 0 5px #6200ea" },
                    "50%": { boxShadow: mode === "dark" ? "0 0 20px #00f5ff" : "0 0 20px #6200ea" },
                    "100%": { boxShadow: mode === "dark" ? "0 0 5px #00f5ff" : "0 0 5px #6200ea" },
                  },
                }}
              >
                <Mic />
              </IconButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={toggleSuggestions}
                color="secondary"
                sx={{
                  bgcolor: mode === "dark" ? "rgba(255, 64, 129, 0.1)" : "rgba(0, 200, 83, 0.1)",
                  "&:hover": {
                    bgcolor: mode === "dark" ? "rgba(255, 64, 129, 0.2)" : "rgba(0, 200, 83, 0.2)",
                  },
                }}
              >
                <Lightbulb />
              </IconButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                endIcon={<Send />}
                onClick={() => handleSubmit(prompt)}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                }}
              >
                Submit
              </Button>
            </motion.div>
          </Box>
        </Box>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper elevation={3} sx={{ p: 2, mt: 1 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {suggestedPrompts.map((suggestedPrompt, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setPrompt(suggestedPrompt);
                          setShowSuggestions(false);
                        }}
                        sx={{
                          borderRadius: 4,
                          textAlign: "left",
                          justifyContent: "flex-start",
                          borderColor:
                            mode === "dark" ? "rgba(0, 245, 255, 0.3)" : "rgba(98, 0, 234, 0.3)",
                          px: 2,
                        }}
                      >
                        {suggestedPrompt}
                      </Button>
                    </motion.div>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};

export default PromptInput;