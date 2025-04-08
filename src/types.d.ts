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