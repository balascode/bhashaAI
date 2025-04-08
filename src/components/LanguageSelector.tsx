import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { motion } from "framer-motion";

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

const languages: { code: LanguageCode }[] = [
  { code: "en" },
  { code: "hi" },
  { code: "ta" },
  { code: "te" },
  { code: "bn" },
];

const LanguageSelector = ({ language, setLanguage }: { language: LanguageCode; setLanguage: (lang: LanguageCode) => void }) => {
  const getLabel = (): string => {
    return selectLanguageLabel[language] || selectLanguageLabel.en;
  };

  const getLanguageName = (code: LanguageCode): string => {
    return languageNames[language]?.[code] || languageNames.en[code];
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <FormControl fullWidth sx={{ maxWidth: 200, mx: "auto", mb: 4 }}>
        <InputLabel>{getLabel()}</InputLabel>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          label={getLabel()}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {getLanguageName(lang.code)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </motion.div>
  );
};

export default LanguageSelector;