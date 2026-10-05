import { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../services/audioUtils';
import { Page } from '../types';
import { PAGE_CONTENT } from '../constants';

const API_KEY = process.env.GEMINI_API_KEY || '';

interface UseGeminiLiveProps {
  onPageChange: (page: Page) => void;
  currentPage: Page;
  onScrollToSection: (sectionId: string) => void;
  setLanguage: (lang: 'en' | 'es' | 'fr') => void;
}

export const useGeminiLive = ({ onPageChange, currentPage, onScrollToSection, setLanguage }: UseGeminiLiveProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for audio and session management
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  // Tool Declarations
  const navigateTool: FunctionDeclaration = {
    name: 'navigateToPage',
    description: 'Navigates the user to a specific page on the website (e.g., Home, Contact, Life Insurance page).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        pageName: {
          type: Type.STRING,
          description: 'The page to navigate to.',
          enum: Object.values(Page)
        }
      },
      required: ['pageName']
    }
  };

  const scrollTool: FunctionDeclaration = {
    name: 'scrollToSection',
    description: 'Scrolls to a specific section on the current page (useful for tours on the Home page).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        sectionId: {
          type: Type.STRING,
          description: 'The ID of the section to scroll to.',
          enum: ['welcome', 'featured-dish', 'testimonials']
        }
      },
      required: ['sectionId']
    }
  };

  const languageTool: FunctionDeclaration = {
    name: 'setLanguage',
    description: 'Changes the application language.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        language: {
          type: Type.STRING,
          description: 'The language code to switch to.',
          enum: ['en', 'es', 'fr']
        }
      },
      required: ['language']
    }
  };

  const connect = async () => {
    if (!API_KEY) {
      console.error("API Key not found");
      setError("API Key not found");
      return;
    }
    console.log("API Key present:", !!API_KEY);

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      // Setup Audio
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      
      // Resume AudioContexts (important for some browsers)
      if (inputAudioContextRef.current.state === 'suspended') {
        await inputAudioContextRef.current.resume();
      }
      if (outputAudioContextRef.current.state === 'suspended') {
        await outputAudioContextRef.current.resume();
      }

      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      console.log("Connecting to Gemini Live...");
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          tools: [{ functionDeclarations: [navigateTool, scrollTool, languageTool] }],
          systemInstruction: `You are Pandora, the AI Assistant for Shelby's Fine Cuisine. 
Your goal is to help users navigate the website, place orders, and learn about the menu.
You are friendly, professional, and knowledgeable about Haitian cuisine.

Key Responsibilities:
1.  **Greeting**: Welcome users warmly.
2.  **Navigation**: Use the 'navigateToPage' tool to take users to different sections (Home, Catering Menu, About Us, Contact Us).
3.  **Tours**: Offer a tour of the website. If accepted, use 'scrollToSection' to show them the Welcome section, Featured Dish, and Testimonials on the Home page.
4.  **Menu Assistance**: Explain dishes like Curry Goat, Griot, and the new Shelby Crema.
5.  **Ordering**: Guide users to the Catering Menu or Checkout page to place orders.

Current Context: The user is browsing the website.
Always be concise and helpful. If the user asks to go somewhere, use the appropriate tool.`
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setIsActive(true);
            
            // Setup input stream
            if (!inputAudioContextRef.current || !streamRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const blob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: blob }));
            };

            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);

            // Trigger Greeting
            sessionPromise.then(session => session.sendRealtimeInput({
                text: "The user has connected. Greet them immediately: 'Welcome to Shelby's Fine Cuisine. I am Shelby's Assistant. Can I take your order or give you a tour?'"
            }));
          },
          onmessage: async (msg: LiveServerMessage) => {
            const { serverContent, toolCall } = msg;

            if (serverContent) {
              const { modelTurn, interrupted, turnComplete } = serverContent;

              if (interrupted) {
                console.log("Interrupted");
                setIsSpeaking(false);
                // Stop all currently playing audio
                sourcesRef.current.forEach(source => {
                  try { source.stop(); } catch (e) {}
                });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                return;
              }

              if (modelTurn?.parts) {
                for (const part of modelTurn.parts) {
                  if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                    setIsSpeaking(true);
                    const audioData = decode(part.inlineData.data);
                    const audioCtx = outputAudioContextRef.current;
                    if (audioCtx) {
                        const buffer = await decodeAudioData(audioData, audioCtx);
                        const source = audioCtx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(audioCtx.destination);
                        
                        const currentTime = audioCtx.currentTime;
                        const startTime = Math.max(currentTime, nextStartTimeRef.current);
                        source.start(startTime);
                        nextStartTimeRef.current = startTime + buffer.duration;
                        
                        sourcesRef.current.add(source);
                        source.onended = () => {
                            sourcesRef.current.delete(source);
                            if (sourcesRef.current.size === 0) {
                                setIsSpeaking(false);
                            }
                        };
                    }
                  }
                }
              }

              if (turnComplete) {
                 // setIsSpeaking(false); // Handled by onended
              }
            }

            if (toolCall) {
                const functionCalls = toolCall.functionCalls;
                const functionResponses = [];
                
                for (const call of functionCalls) {
                    let response: { result?: string; error?: string } = { result: "Success" };
                    try {
                        if (call.name === 'navigateToPage') {
                            const { pageName } = call.args as any;
                            onPageChange(pageName);
                        } else if (call.name === 'scrollToSection') {
                            const { sectionId } = call.args as any;
                            onScrollToSection(sectionId);
                        } else if (call.name === 'setLanguage') {
                            const { language } = call.args as any;
                            setLanguage(language);
                        }
                    } catch (e) {
                        console.error("Tool Execution Error", e);
                        response = { error: (e as Error).message };
                    }
                    
                    functionResponses.push({
                        id: call.id,
                        name: call.name,
                        response: response
                    });
                }
                
                sessionPromise.then(session => session.sendToolResponse({ functionResponses }));
            }
          },
          onclose: () => {
            console.log("Gemini Live Disconnected");
            setIsActive(false);
            setIsSpeaking(false);
          },
          onerror: (err) => {
            console.error("Gemini Error", err);
            setError(err.message || "Connection error");
            setIsActive(false);
          }
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

    } catch (e) {
      console.error("Failed to start session:", e);
      setError("Failed to start session");
      setIsActive(false);
    }
  };

  const disconnect = () => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
    }
    
    streamRef.current?.getTracks().forEach(t => t.stop());
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    
    setIsActive(false);
    setIsSpeaking(false);
  };

  const sendPageContext = (page: Page) => {
    if (!isActive || !sessionPromiseRef.current) return;
    
    const content = PAGE_CONTENT[page];
    const prompt = `System Update: User is now on the ${content.title} page.
    Details: ${content.details}`;

    sessionPromiseRef.current.then(session => {
        session.sendRealtimeInput({
            text: prompt
        });
    });
  };

  return { connect, disconnect, isActive, isSpeaking, sendPageContext, error };
};