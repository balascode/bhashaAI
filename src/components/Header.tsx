import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip, Avatar } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { motion } from "framer-motion";

// Define valid language codes and personas
type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn';
type Persona = 'farmer' | 'developer' | 'student' | 'educated' | 'uneducated';

// User persona icons and their labels
const personas: { id: Persona; icon: string; label: string }[] = [
  { id: "farmer", icon: "👨‍🌾", label: "Farmer" },
  { id: "developer", icon: "👨‍💻", label: "Software Developer" },
  { id: "student", icon: "👨‍🎓", label: "Student" },
  { id: "educated", icon: "🧑‍🏫", label: "Educated" },
  { id: "uneducated", icon: "👷‍♂️", label: "Uneducated" },
];

interface HeaderProps {
  language: LanguageCode;
  selectedPersona: string | null;
  setSelectedPersona: (persona: string) => void;
}

const Header = ({ language, selectedPersona, setSelectedPersona }: HeaderProps) => {
  const { toggleTheme, mode } = useContext(ThemeContext);

  // Use the loadingTitle from uiText (defined in App.tsx) for dynamic "BHASHA AI"
  const title = language === "en" ? "BHASHA AI" : (language === "hi" ? "भाषा AI" : (language === "ta" ? "பாஷா AI" : (language === "te" ? "భాష AI" : (language === "bn" ? "ভাষা AI" : "BHASHA AI"))));

  return (
    <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              animate={{
                color: mode === 'dark' ? ['#00f5ff', '#ff4081', '#00f5ff'] : ['#6200ea', '#00c853', '#6200ea'],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '2px',
                  textShadow: mode === 'dark' ? '0 0 10px rgba(0, 245, 255, 0.6)' : 'none',
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                }}
              >
                {title.split("AI")[0]}
                <span style={{ color: mode === 'dark' ? '#ff4081' : '#00c853' }}>AI</span>
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* User Persona Selection */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
          {personas.map((persona) => (
            <motion.div
              key={persona.id}
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Tooltip title={persona.label}>
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedPersona === persona.id
                      ? (mode === 'dark' ? 'rgba(0, 245, 255, 0.3)' : 'rgba(98, 0, 234, 0.3)')
                      : 'transparent',
                    fontSize: '1.5rem',
                    boxShadow: selectedPersona === persona.id
                      ? (mode === 'dark' ? '0 0 10px rgba(0, 245, 255, 0.6)' : '0 0 10px rgba(98, 0, 234, 0.6)')
                      : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.2)' : 'rgba(98, 0, 234, 0.2)',
                    },
                  }}
                  onClick={() => setSelectedPersona(persona.id)}
                >
                  {persona.icon}
                </Avatar>
              </Tooltip>
            </motion.div>
          ))}
        </Box>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{
              bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(98, 0, 234, 0.1)',
              '&:hover': {
                bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.2)' : 'rgba(98, 0, 234, 0.2)',
              },
              boxShadow: mode === 'dark' ? '0 0 10px rgba(0, 245, 255, 0.3)' : 'none',
            }}
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;