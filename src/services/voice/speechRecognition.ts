// Browser Web Speech API SpeechRecognition Service

export type SpeechLang = "en-IN" | "mr-IN" | "hi-IN" | "auto";

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
}

export class VoiceRecognitionService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (isSpeechRecognitionSupported()) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  public start(lang: SpeechLang, handlers: SpeechRecognitionHandlers) {
    if (!this.recognition) {
      handlers.onError?.("Speech recognition is not supported in this browser.");
      return;
    }

    if (this.isListening) {
      this.stop();
    }

    // Set speech language code
    if (lang === "mr-IN") {
      this.recognition.lang = "mr-IN";
    } else if (lang === "hi-IN") {
      this.recognition.lang = "hi-IN";
    } else if (lang === "en-IN") {
      this.recognition.lang = "en-IN";
    } else {
      // Auto: Default to mr-IN or en-IN depending on browser
      this.recognition.lang = "mr-IN";
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      handlers.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      handlers.onResult?.(text, Boolean(finalTranscript));
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let errMsg = "Speech recognition error";
      if (event.error === "no-speech") {
        errMsg = "No speech detected. Please speak clearly into the microphone.";
      } else if (event.error === "not-allowed") {
        errMsg = "Microphone access denied. Please enable microphone permissions in your browser.";
      } else if (event.error === "network") {
        errMsg = "Network connection required for speech recognition.";
      }
      handlers.onError?.(errMsg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      handlers.onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
      this.isListening = false;
      handlers.onError?.("Could not access microphone.");
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn("Error stopping speech recognition:", e);
      }
      this.isListening = false;
    }
  }
}
