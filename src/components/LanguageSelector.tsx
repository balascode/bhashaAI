import { FormControl, InputLabel, Select, MenuItem, Box, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

// Define valid language codes
type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn';

// Language names in different languages
const languageNames: Record<LanguageCode, Record<LanguageCode, string>> = {
  en: {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    bn: "Bengali",
  },
  hi: {
    en: "अंग्रेज़ी",
    hi: "हिंदी",
    ta: "तमिल",
    te: "తెలుగు",
    bn: "बंगाली",
  },
  ta: {
    en: "ஆங்கிலம்",
    hi: "இந்தி",
    ta: "தமிழ்",
    te: "தெலுங்கு",
    bn: "வங்காளம்",
  },
  te: {
    en: "ఆంగ్లం",
    hi: "హిందీ",
    ta: "తమిళం",
    te: "తెలుగు",
    bn: "బెంగాలీ",
  },
  bn: {
    en: "ইংরেজি",
    hi: "হিন্দি",
    ta: "তামিল",
    te: "তেলুগু",
    bn: "বাংলা",
  },
};

// Labels for "Select Language" in different languages
const selectLanguageLabel: Record<LanguageCode, string> = {
  en: "Select Language",
  hi: "भाषा चुनें",
  ta: "மொழியைத் தேர்ந்தெடுக்கவும்",
  te: "భాషను ఎంచుకోండి",
  bn: "ভাষা নির্বাচন করুন",
};

// Language flags (emoji) for visual representation
const languageFlags: Record<LanguageCode, string> = {
  en: "🇬🇧",
  hi: "🇮🇳",
  ta: "🇮🇳",
  te: "🇮🇳",
  bn: "🇧🇩",
};

const languages: { code: LanguageCode }[] = [
  { code: "en" },
  { code: "hi" },
  { code: "ta" },
  { code: "te" },
  { code: "bn" },
];

interface LanguageSelectorProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const LanguageSelector = ({ language, setLanguage }: LanguageSelectorProps) => {
  const { mode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const getLabel = (): string => {
    return selectLanguageLabel[language] || selectLanguageLabel.en;
  };

  const getLanguageName = (code: LanguageCode): string => {
    return languageNames[language]?.[code] || languageNames.en[code];
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        my: { xs: 2, sm: 3 },
        mt: { xs: 10, sm: 5 },
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        style={{ width: isMobile ? '90%' : '250px' }}
      >
        <FormControl 
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(98, 0, 234, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.2)' : 'rgba(98, 0, 234, 0.2)',
                boxShadow: mode === 'dark' ? '0 0 10px rgba(0, 245, 255, 0.3)' : '0 0 10px rgba(98, 0, 234, 0.3)',
              },
              '&.Mui-focused': {
                boxShadow: mode === 'dark' ? '0 0 15px rgba(0, 245, 255, 0.5)' : '0 0 15px rgba(98, 0, 234, 0.5)',
              }
            },
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            },
            '& .MuiInputLabel-root': {
              color: mode === 'dark' ? '#00f5ff' : '#6200ea',
              '&.Mui-focused': {
                color: mode === 'dark' ? '#ff4081' : '#00c853',
              }
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? 'rgba(0, 245, 255, 0.5)' : 'rgba(98, 0, 234, 0.5)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? '#00f5ff' : '#6200ea',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? '#ff4081' : '#00c853',
            }
          }}
        >
          <InputLabel 
            sx={{ 
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: '1px',
            }}
          >
            {getLabel()}
          </InputLabel>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            label={getLabel()}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: mode === 'dark' ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  boxShadow: mode === 'dark' 
                    ? '0 4px 20px rgba(0, 245, 255, 0.3)' 
                    : '0 4px 20px rgba(98, 0, 234, 0.3)',
                  '& .MuiMenuItem-root': {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.2)' : 'rgba(98, 0, 234, 0.2)',
                    },
                    '&.Mui-selected': {
                      bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.3)' : 'rgba(98, 0, 234, 0.3)',
                      '&:hover': {
                        bgcolor: mode === 'dark' ? 'rgba(0, 245, 255, 0.4)' : 'rgba(98, 0, 234, 0.4)',
                      }
                    }
                  }
                }
              }
            }}
            sx={{
              fontFamily: "'Orbitron', sans-serif",
              '& .MuiSvgIcon-root': {
                color: mode === 'dark' ? '#00f5ff' : '#6200ea',
              }
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{languageFlags[selected as LanguageCode]}</span>
                <span>{getLanguageName(selected as LanguageCode)}</span>
              </Box>
            )}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{languageFlags[lang.code]}</span>
                  <span>{getLanguageName(lang.code)}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </motion.div>
    </Box>
  );
};

export default LanguageSelector;