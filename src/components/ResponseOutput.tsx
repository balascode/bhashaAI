import { useState, useEffect, useContext } from "react"; // Added React hooks
import { Box, Typography, Paper, LinearProgress } from "@mui/material"; // Added MUI components
import { motion, AnimatePresence } from "framer-motion"; // Added Framer Motion
import { ThemeContext } from "../contexts/ThemeContext"; // Added ThemeContext

const ResponseOutput = ({ response }: { response: string }) => {
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { mode } = useContext(ThemeContext);

  useEffect(() => {
    if (response) {
      setIsTyping(true);
      let i = 0;
      setDisplayedResponse("");

      const intervalId = setInterval(() => {
        if (i < response.length) {
          setDisplayedResponse((prev: string) => prev + response.charAt(i)); // Typed prev as string
          i++;
        } else {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, 20); // Speed of typing effect

      return () => clearInterval(intervalId);
    }
  }, [response]);

  return (
    <AnimatePresence mode="wait">
      {(response || displayedResponse) && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          key="response-container"
        >
          <Box sx={{ mt: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: mode === "dark" ? "rgba(0, 245, 255, 0.1)" : "rgba(98, 0, 234, 0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {isTyping && (
                <Box sx={{ width: "100%", position: "absolute", top: 0, left: 0 }}>
                  <LinearProgress
                    color={mode === "dark" ? "primary" : "secondary"}
                    sx={{
                      height: 2,
                      "& .MuiLinearProgress-bar": {
                        transition: "none",
                      },
                    }}
                  />
                </Box>
              )}

              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.7,
                  position: "relative",
                  "&::after": isTyping
                    ? {
                        content: '"|"',
                        color: mode === "dark" ? "#00f5ff" : "#6200ea",
                        fontWeight: "bold",
                        animation: "blink 1s step-end infinite",
                      }
                    : {},
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0 },
                  },
                }}
              >
                {displayedResponse || "Your response will appear here..."}
              </Typography>
            </Paper>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponseOutput;