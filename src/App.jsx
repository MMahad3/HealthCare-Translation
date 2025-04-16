import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('fr'); 

  // Supported languages with their codes and names
  const languages = [
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  // Initialize speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const handleSpeechRecognition = async () => {
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsLoading(true);
      toast.info('Recording started', { autoClose: 1500 });
    };

    recognition.onresult = async (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      toast.success('Recording complete!', { autoClose: 3000 });
      
      try {
        const response = await axios.post('http://localhost:8000/translate/', {
          text: result,
          target_lang: targetLanguage,
        });
        setTranslatedText(response.data.translated_text);
      } catch (error) {
        console.error('Translation error:', error);
        toast.error('Translation failed');
      } finally {
        setIsLoading(false);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      toast.error('Recording failed');
      setIsLoading(false);
    };


    recognition.start();
  };

  const handleAudioPlayback = async () => {
    if (!translatedText) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/speak/',
        { text: translatedText },
        { responseType: 'blob' }
      );
  
      
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
  
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsLoading(false);
      };
  
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl); 
        setIsLoading(false);
      };
  
      audio.play();
    } catch (error) {
      console.error('Error during audio playback:', error);
      setIsLoading(false);
    }
  };

  return (

    <div className="h-screen flex flex-col">
  
  <header className="bg-blue-600 text-white p-4 shadow-md justify-center">
    <h1 className="text-2xl sm:text-3xl font-bold text-center font-serif">Healthcare Translator</h1>
    <p className="text-sm sm:text-base text-center font-serif">Muhammad Mahad Munir</p>
  </header>

  <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
  <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">

    
    <div className="w-full">
          <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1 text-center">
            Translate to:
          </label>
          <select
            id="language-select"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
    

    <button
      onClick={handleSpeechRecognition}
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Recording...
        </span>
      ) : (
        'Start Recording'
      )}
    </button>

    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold text-gray-700 mb-2 text-center">Transcript:</h2>
        <p className="text-gray-800 text-center">{transcript || <span className="text-gray-400 text-center">Your speech will appear here</span>}</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold text-gray-700 mb-2 text-center">Translated Text:</h2>
        <p className="text-gray-800 text-center">{translatedText || <span className="text-gray-400 text-center">Translation will appear here</span>}</p>
      </div>
    </div>

    <button
      onClick={handleAudioPlayback}
      disabled={isLoading || !translatedText}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Processing Audio...' : 'Speak Translation'}
    </button>
  </div>
</div>
   
  <footer className="bg-blue-100 text-center text-sm text-blue-900 py-2">
    &copy; {new Date().getFullYear()} Muhammad Mahad Munir — All Rights Reserved.
  </footer>
  <ToastContainer position="top-right" />
  </div>
  );
}

export default App;