import { useContext } from "react"; // Added for useContext
import { Box, Typography, Paper, Chip } from "@mui/material"; // Added MUI components
import { motion } from "framer-motion"; // Added for motion
import { ThemeContext } from "../contexts/ThemeContext"; // Added for ThemeContext

const PromptLibrary = ({ onSelect }: { onSelect: (prompt: string) => void }) => {
  const { mode } = useContext(ThemeContext);

  const promptsByCategory = [
    {
      category: "Business",
      prompts: [
        "मुझे एक ऑनलाइन बिजनेस शुरू करने में मदद चाहिए।",
        "स्टार्टअप के लिए फंडिंग कैसे मिलेगी?",
        "मार्केटिंग स्ट्रैटेजी क्या होनी चाहिए?",
      ],
    },
    {
      category: "Agriculture",
      prompts: [
        "किसान के लिए फसल योजना बनाएं।",
        "जैविक खेती कैसे करें?",
        "फसल बीमा के बारे में जानकारी दें।",
      ],
    },
    {
      category: "Education",
      prompts: [
        "बच्चों को पढ़ाने के लिए अच्छे तरीके बताएं।",
        "परीक्षा की तैयारी कैसे करें?",
        "ऑनलाइन लर्निंग के फायदे क्या हैं?",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const categoryVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        mass: 0.8,
      },
    },
  };

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            textAlign: "center",
            fontSize: { xs: "1rem", sm: "1.25rem" },
            fontWeight: 500,
          }}
        >
          Popular Prompts
        </Typography>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {promptsByCategory.map((category, categoryIndex) => (
            <motion.div key={categoryIndex} variants={categoryVariants}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  width: { xs: "100%", md: "auto" },
                  minWidth: { md: 280 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      mode === "dark"
                        ? "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 245, 255, 0.2)"
                        : "0 10px 40px rgba(0, 0, 0, 0.1), 0 0 15px rgba(98, 0, 234, 0.1)",
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: mode === "dark" ? "primary.main" : "secondary.main",
                    borderBottom: `1px solid ${
                      mode === "dark" ? "rgba(0, 245, 255, 0.2)" : "rgba(0, 200, 83, 0.2)"
                    }`,
                    pb: 1,
                  }}
                >
                  {category.category}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                  {category.prompts.map((prompt, promptIndex) => (
                    <motion.div
                      key={promptIndex}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Chip
                        label={prompt}
                        onClick={() => onSelect(prompt)}
                        sx={{
                          p: 2,
                          height: "auto",
                          "& .MuiChip-label": {
                            whiteSpace: "normal",
                            display: "block",
                            lineHeight: 1.5,
                            py: 0.5,
                          },
                          bgcolor:
                            mode === "dark"
                              ? "rgba(0, 245, 255, 0.05)"
                              : "rgba(98, 0, 234, 0.05)",
                          "&:hover": {
                            bgcolor:
                              mode === "dark"
                                ? "rgba(0, 245, 255, 0.1)"
                                : "rgba(98, 0, 234, 0.1)",
                          },
                          borderRadius: 2,
                          justifyContent: "flex-start",
                          cursor: "pointer",
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
};

export default PromptLibrary;