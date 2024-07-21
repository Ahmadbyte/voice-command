import React, { useEffect, useCallback, useState, useMemo } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Fuse from 'fuse.js';
import './voice.css'; // Import the CSS file

const VoiceAssistant = () => {
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  // Define commands with URLs
  const commands = useMemo(() => [
    { phrase: 'gmail', url: 'https://gmail.com' },
    { phrase: 'youtube', url: 'https://youtube-dupl.onrender.com/' },
    { phrase: 'instagram', url: 'https://www.instagram.com' }, // Web URL fallback
    { phrase: 'facebook', url: 'https://www.facebook.com' },
    { phrase: 'portfolio', url: 'https://my-portfolio-1tju.onrender.com' },
    { phrase: 'linkedin', url: 'https://in.linkedin.com/in/sharique01' },
    { phrase: 'gethub', url: 'https://github.com/Ahmadbyte' },
    { phrase: 'whatsapp', url: 'whatsapp://send?text=Hello%20World' } // Default WhatsApp message
  ], []);

  // Memoize fuse instance to prevent recreation on every render
  const fuse = useMemo(() => new Fuse(commands, {
    keys: ['phrase'],
    threshold: 0.3,
  }), [commands]);

  const handleCommand = useCallback((command) => {
    console.log('Command received:', command);

    if (command.startsWith('whatsapp')) {
      const url = 'whatsapp://send?text=Hello%20World';
      if (window.navigator.userAgent.match(/Android|iPhone|iPad|iPod/)) {
        window.location.href = url;
      } else {
        // Fallback for desktops
        window.open('https://web.whatsapp.com/send?text=Hello%20World', '_blank');
      }
    } else if (command.startsWith('instagram')) {
      const url = 'instagram://app';
      const webUrl = 'https://www.instagram.com';
      if (window.navigator.userAgent.match(/Android|iPhone|iPad|iPod/)) {
        window.location.href = url;
        // Provide a slight delay to ensure URL scheme processing
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            window.open(webUrl, '_blank');
          }
        }, 2000);
      } else {
        // Fallback for desktops
        window.open(webUrl, '_blank');
      }
    } else if (command.startsWith('contact')) {
    const url = 'intent://contacts/#Intent;action=android.intent.action.PICK;type=vnd.android.cursor.dir/contact;end';
      if (window.navigator.userAgent.match(/Android/)) {
        window.location.href = url;
      } else {
        // Fallback for other devices
        console.log('Direct contact app access is not supported on this device.');
      }
    } else {
      const result = fuse.search(command);
      if (result.length > 0) {
        const url = result[0].item.url;
        if (url.startsWith('whatsapp://') || url.startsWith('instagram://')) {
          window.location.href = url;
        } else {
          window.open(url, '_blank');
        }
      } else {
        console.log('Command not recognized');
      }
    }
    resetTranscript();
  }, [resetTranscript, fuse]);

  useEffect(() => {
    if (transcript) {
      console.log('Transcript received:', transcript);
      setLastCommand(transcript.toLowerCase());
      handleCommand(transcript.toLowerCase());
    }
  }, [transcript, handleCommand]);

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });

    // Text-to-speech for welcome message
    const speech = new SpeechSynthesisUtterance('Hey, Welcome Back - Please speak...');
    window.speechSynthesis.speak(speech);
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="voice-assistant-container">
      <div className="voice-assistant-heading">Voice Assistant</div>
      <img src="/vc.jpg" alt="3D Graphic" className="voice-assistant-image" />
      <button className={`voice-assistant-button ${isListening ? 'active' : ''}`} onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Voice Assistant' : 'Start Voice Assistant'}
      </button>
      <p className="voice-assistant-transcript">{transcript}</p>
      <p className="voice-assistant-status">Listening: {listening ? 'Yes' : 'No'}</p>
      <p className="voice-assistant-command">Last Command: {lastCommand}</p>
    </div>
  );
};

export default VoiceAssistant;
