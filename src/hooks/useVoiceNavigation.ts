import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { VoiceRecognitionService, isSpeechRecognitionSupported } from "../services/voice/speechRecognition";
import { VoiceSynthesisService } from "../services/voice/speechSynthesis";
import { processVoiceQuery, AssistantContext, AssistantResponse } from "../services/voice/intentEngine";
import { Tab } from "../App";

export type VoiceStatus = "IDLE" | "LISTENING" | "PROCESSING" | "SPEAKING" | "ERROR";

export interface MessageLog {
  id: string;
  sender: "user" | "assistant";
  text: string;
  lang?: "en" | "mr" | "hi";
  intent?: string;
}

export function useVoiceNavigation(
  context: AssistantContext,
  onNavigateTab: (tab: Tab) => void
) {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<VoiceStatus>("IDLE");
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageLog[]>([]);

  const recognitionRef = useRef<VoiceRecognitionService | null>(null);
  const synthRef = useRef<VoiceSynthesisService | null>(null);
  const isSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    recognitionRef.current = new VoiceRecognitionService();
    synthRef.current = new VoiceSynthesisService();

    // Initial greeting in current language
    const initGreeting =
      language === "mr"
        ? "नमस्कार! मी किसान सारथी एआय सहाय्यक आहे. बोला, मी तुम्हाला मदत करू शकतो."
        : "Namaste! I am Kisan Sarthi AI assistant. How can I help your farm today?";

    setMessages([
      {
        id: "init",
        sender: "assistant",
        text: initGreeting,
        lang: language === "mr" ? "mr" : "en"
      }
    ]);

    return () => {
      recognitionRef.current?.stop();
      synthRef.current?.stop();
    };
  }, []);

  // Sync recognition & synthesis language with active i18n language
  const activeSpeechLang = language === "mr" ? "mr-IN" : "en-IN";
  const activeResponseLang = language === "mr" ? "mr" : "en";

  const startListening = useCallback(() => {
    if (!isSupported) {
      setStatus("ERROR");
      setErrorMessage(t("voice_unsupported"));
      return;
    }

    synthRef.current?.stop();
    setErrorMessage(null);
    setTranscript("");

    recognitionRef.current?.start(activeSpeechLang, {
      onStart: () => {
        setStatus("LISTENING");
      },
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim()) {
          recognitionRef.current?.stop();
          processQuery(text);
        }
      },
      onError: (err) => {
        setStatus("ERROR");
        setErrorMessage(err || t("voice_error_try_again"));
      },
      onEnd: () => {
        setStatus((prev) => (prev === "LISTENING" ? "IDLE" : prev));
      }
    });
  }, [activeSpeechLang, isSupported, t]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus("IDLE");
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.stop();
    setStatus("IDLE");
  }, []);

  const processQuery = useCallback(
    (queryText: string) => {
      if (!queryText.trim()) return;

      setStatus("PROCESSING");
      const userMsg: MessageLog = {
        id: Date.now().toString() + "-u",
        sender: "user",
        text: queryText
      };

      setMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        // Enforce active i18n language for NLP intent engine
        const response: AssistantResponse = processVoiceQuery(
          queryText,
          context,
          activeResponseLang
        );

        const assistantMsg: MessageLog = {
          id: Date.now().toString() + "-a",
          sender: "assistant",
          text: response.responseText,
          lang: response.detectedLang,
          intent: response.intent
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Route navigation execution
        if (response.navigateTab) {
          onNavigateTab(response.navigateTab);
        }

        // Speak back response in matching BCP 47 language
        if (synthRef.current) {
          setStatus("SPEAKING");
          synthRef.current.speak(response.responseText, response.detectedLang, () => {
            setStatus("IDLE");
          });
        } else {
          setStatus("IDLE");
        }
      }, 300);
    },
    [activeResponseLang, context, onNavigateTab]
  );

  return {
    status,
    transcript,
    messages,
    errorMessage,
    isSupported,
    activeSpeechLang,
    activeResponseLang,
    startListening,
    stopListening,
    stopSpeaking,
    processQuery
  };
}
