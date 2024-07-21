import React, { useEffect, useCallback, useState, useMemo } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Fuse from 'fuse.js';
import './voice.css'; // Import the CSS file

const VoiceAssistant = () => {
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  // Define a mapping of names to phone numbers
  const contactList = useMemo(() => ({
    safi: '7992217849',
    ammi: '7903780528',
    abbu: '8797068762',
    fsl: '9123437796',
    ksf: '9709921626'
  }), []);

  // Define commands with URLs
  const commands = useMemo(() => [
    { phrase: 'gmail', url: 'https://gmail.com' },
    { phrase: 'youtube', url: 'https://youtube-dupl.onrender.com/' },
    { phrase: 'instagram', url: 'instagram://app' },
    { phrase: 'gram', url: 'https://www.instagram.com/?next=https%3A%2F%2Fwww.instagram.com%2Fdirect%2Ft%2F17844984425941519%2F%3Fhl%3Den%26__coig_login%3D1' },
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

    // Handle call command
    if (command.startsWith('call ')) {
      const name = command.slice(5).trim(); // Extract name after 'call '
      const phoneNumber = contactList[name];
      if (phoneNumber) {
        window.location.href = `tel:${phoneNumber}`;
      } else {
        console.log('Name not found in contact list');
      }
    } else {
      const result = fuse.search(command);
      if (result.length > 0) {
        window.open(result[0].item.url, '_blank');
      } else {
        console.log('Command not recognized');
      }
    }
    resetTranscript();
  }, [resetTranscript, fuse, contactList]);

  useEffect(() => {
    if (transcript) {
      console.log('Transcript received:', transcript);
      setLastCommand(transcript.toLowerCase());
      handleCommand(transcript.toLowerCase());
    }
  }, [transcript, handleCommand]);

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' }); // Added language option

    // Text-to-speech for welcome message
    const speech = new SpeechSynthesisUtterance('Hey you there, Happy to see you back- Please speak...');
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
