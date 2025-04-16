# React + Vite

# 🩺 Healthcare Voice Translator

A real-time multilingual voice translator web app designed for healthcare settings. This tool allows medical professionals and patients to break language barriers by speaking into the app, which then translates the input and speaks it back in the selected language.

---

## 📋 Features

- 🎙️ **Speech Recognition**: Capture voice input using the browser's native capabilities.
- 🌍 **Language Translation**: Automatically translates spoken input to a target language.
- 🔊 **Text-to-Speech Playback**: Speaks the translated text using realistic AI-generated voice.
- 💻 **Simple Frontend UI**: Clean and intuitive React interface with Tailwind CSS.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Web Speech API (SpeechRecognition)

### Backend
- FastAPI
- Google Translate (via `googletrans`)
- gTTS (Google Text-to-Speech)
- Whisper (OpenAI) *(optional if using `/transcribe`)*

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- pip

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
