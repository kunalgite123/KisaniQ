// Browser Speech Synthesis (Text-To-Speech) Service

export type ResponseLang = "en" | "mr" | "hi";

export class VoiceSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string, lang: ResponseLang, onEnd?: () => void) {
    if (!this.synth) {
      onEnd?.();
      return;
    }

    this.stop(); // Stop any ongoing speech first

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Determine target BCP 47 language code
    const langCode = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    utterance.lang = langCode;
    utterance.rate = 0.95; // Slightly calmer speaking rate
    utterance.pitch = 1.0;

    // Try to find matching voice on system
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang === langCode || v.lang.startsWith(lang) || (lang === "mr" && v.lang.includes("hi"))
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      this.currentUtterance = null;
      onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Could not execute speech synthesis:", e);
      onEnd?.();
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn("Error stopping speech synthesis:", e);
      }
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth && (this.synth.speaking || this.synth.pending));
  }
}
