import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const AudioMessage = ({ url, duration }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [waveData, setWaveData] = useState([]);

  // Generate a deterministic-ish wave pattern per render
  useEffect(() => {
    const bars = 20;
    const waves = Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);
    setWaveData(waves);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => setTotalTime(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
    setIsPlaying(p => !p);
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = totalTime > 0 ? currentTime / totalTime : 0;

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl px-4 py-3 max-w-sm shadow-sm">
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center text-white shadow"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <div className="flex-1 flex items-center gap-1 h-8">
        {waveData.map((w, i) => {
          const barProgress = i / waveData.length;
          const isActive = barProgress <= progress;
          const height = `${Math.max(2, Math.round(w * 100))}%`;
          return (
            <div
              key={i}
              className={`rounded-full transition-all duration-150 ${isActive ? 'bg-blue-500' : 'bg-blue-300'}`}
              style={{ height, flex: '1 1 0', minWidth: 2, opacity: isActive ? 1 : 0.6 }}
            />
          );
        })}
      </div>

      <div className="text-xs font-medium text-gray-700 min-w-[40px] text-right">
        {formatTime(Math.max(0, totalTime - currentTime))}
      </div>

      <audio ref={audioRef} src={url} preload="metadata" />
    </div>
  );
};

export default AudioMessage;
