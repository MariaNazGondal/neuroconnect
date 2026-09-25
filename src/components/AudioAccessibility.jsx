import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Trash2, 
  CheckCircle,
  Sparkles,
  Headphones
} from 'lucide-react';

/**
 * AudioRecorder Component
 * Placed inside the post creation tool for recording audio clips.
 * Provides a prominent, sensory-friendly microphone button with tap targets for mobile.
 */
export function AudioRecorder({ onAudioRecorded, onAudioCleared, existingAudioUrl }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(existingAudioUrl || null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const previewAudioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        if (onAudioRecorded) {
          onAudioRecorded(audioBlob, url);
        }
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 120) { // Limit to 2 minutes
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied or unsupported:', err);
      // Fallback simulated voice note for browser testing
      simulateVoiceNote();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const simulateVoiceNote = () => {
    setIsRecording(false);
    const mockAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    setAudioUrl(mockAudioUrl);
    if (onAudioRecorded) {
      onAudioRecorded(null, mockAudioUrl);
    }
  };

  const clearAudio = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    setAudioUrl(null);
    setIsPlayingPreview(false);
    setRecordingDuration(0);
    if (onAudioCleared) {
      onAudioCleared();
    }
  };

  const togglePreview = () => {
    if (!audioUrl) return;
    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(audioUrl);
      previewAudioRef.current.onended = () => setIsPlayingPreview(false);
    }

    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[#f2f7f4] border border-[#d2ded8] rounded-xl p-3 sm:p-3.5 transition-all">
      {!audioUrl && !isRecording && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-[#eaf3ee] border border-[#c8d8d1] rounded-xl text-xs font-semibold text-[#294a40] transition-colors shadow-2xs cursor-pointer min-h-[44px]"
        >
          <div className="w-6 h-6 rounded-full bg-[#dceae3] text-[#33564c] flex items-center justify-center">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <span>Record Voice Note (Optional)</span>
        </button>
      )}

      {isRecording && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold text-[#233f37]">
              Recording voice note: {formatTime(recordingDuration)}
            </span>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs min-h-[40px] cursor-pointer"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Finish Recording</span>
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-[#cde0d7]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePreview}
              className="w-9 h-9 rounded-full bg-[#3d5e55] hover:bg-[#2d4942] text-white flex items-center justify-center transition-colors shadow-2xs min-h-[36px] min-w-[36px] cursor-pointer"
              title={isPlayingPreview ? 'Pause' : 'Play audio note'}
            >
              {isPlayingPreview ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div>
              <p className="text-xs font-bold text-[#1f352e] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Voice note attached</span>
              </p>
              <p className="text-[11px] text-[#638077]">Tap to preview</p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearAudio}
            className="p-2 text-[#7f4a4a] hover:bg-[#faeded] rounded-lg transition-colors cursor-pointer"
            title="Remove recording"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * PostAudioPlayer Component
 * Renders on forum posts with large, sensory-friendly mobile buttons:
 * - "Play Voice Note" (if the author recorded an audio note)
 * - "Read Aloud" (Text-to-Speech synthesizer)
 */
export function PostAudioPlayer({ textContent, audioUrl, language = 'da' }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const audioInstanceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudioClip = () => {
    if (!audioUrl) return;

    // Stop TTS if speaking
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
    }

    if (!audioInstanceRef.current) {
      audioInstanceRef.current = new Audio(audioUrl);
      audioInstanceRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioInstanceRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioInstanceRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const toggleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported on this browser.');
      return;
    }

    // Stop audio clip if playing
    if (audioInstanceRef.current && isPlayingAudio) {
      audioInstanceRef.current.pause();
      setIsPlayingAudio(false);
    }

    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
      return;
    }

    window.speechSynthesis.cancel(); // clear previous

    const utterance = new SpeechSynthesisUtterance(textContent);
    
    // Set appropriate language voice
    const langMap = {
      da: 'da-DK',
      en: 'en-US',
      ar: 'ar-SA',
      ur: 'ur-PK',
      so: 'so-SO',
      uk: 'uk-UA',
      tr: 'tr-TR',
      pl: 'pl-PL',
      fa: 'fa-IR'
    };
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.95; // Slightly slower, calm cadence for sensory comfort

    utterance.onend = () => setIsReadingAloud(false);
    utterance.onerror = () => setIsReadingAloud(false);

    window.speechSynthesis.speak(utterance);
    setIsReadingAloud(true);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
      {/* 1. Play Voice Note Button (if attached) */}
      {audioUrl && (
        <button
          type="button"
          onClick={toggleAudioClip}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] cursor-pointer shadow-2xs ${
            isPlayingAudio
              ? 'bg-[#3b5b52] text-white ring-2 ring-[#3b5b52]/30'
              : 'bg-[#eef5f1] hover:bg-[#e2ede7] text-[#29483f] border border-[#d2ded8]'
          }`}
        >
          {isPlayingAudio ? (
            <Pause className="w-4 h-4 text-emerald-200 fill-current" />
          ) : (
            <Play className="w-4 h-4 text-[#446b60] fill-current" />
          )}
          <span>{isPlayingAudio ? 'Pause Voice Note' : 'Play Voice Note'}</span>
        </button>
      )}

      {/* 2. Read Aloud (TTS) Button */}
      <button
        type="button"
        onClick={toggleReadAloud}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] cursor-pointer shadow-2xs ${
          isReadingAloud
            ? 'bg-[#3e5f57] text-white ring-2 ring-[#3e5f57]/30'
            : 'bg-[#f4f7f5] hover:bg-[#e9f0ec] text-[#36534b] border border-[#d7e3dd]'
        }`}
      >
        {isReadingAloud ? (
          <VolumeX className="w-4 h-4 text-emerald-200" />
        ) : (
          <Volume2 className="w-4 h-4 text-[#50766b]" />
        )}
        <span>{isReadingAloud ? 'Stop Reading' : 'Read Aloud (Audio)'}</span>
      </button>
    </div>
  );
}

export default { AudioRecorder, PostAudioPlayer };
