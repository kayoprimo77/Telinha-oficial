import React, { useState, useRef, useEffect } from 'react';
import { Check, CheckCheck, Play, Pause, Mic, AlertCircle } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const AudioPlayer: React.FC<{ url: string; isMe: boolean }> = ({ url, isMe }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const current = audio.currentTime;
      const total = audio.duration;
      // Handle infinite duration (common in streams or some file formats like opus before full load)
      if (isFinite(total) && total > 0) {
        setProgress((current / total) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };

    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleError = (e: Event) => {
      console.error("Audio playback error:", audio.error);
      setError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = async () => {
    if (audioRef.current && !error) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Play failed:", err);
          setIsPlaying(false);
        }
      }
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      {/* Changed preload to auto to help with length detection of opus files */}
      <audio 
        ref={audioRef} 
        src={url} 
        preload="auto" 
        playsInline 
      />
      
      <div className="relative">
         <button 
           onClick={togglePlay}
           disabled={error}
           className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isMe ? 'bg-[#a9dbb9]' : 'bg-[#e9e9eb]'} text-[#54656f] ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
         >
           {error ? (
             <AlertCircle size={20} className="text-red-500" />
           ) : isPlaying ? (
             <Pause size={20} fill="currentColor" /> 
           ) : (
             <Play size={20} fill="currentColor" className="ml-0.5" />
           )}
         </button>
         {!error && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                <Mic size={12} className={isMe ? 'text-[#00a884]' : 'text-[#54656f]'} />
            </div>
         )}
      </div>

      <div className="flex flex-col flex-1 gap-1">
        <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden mt-2">
           <div 
             className={`h-full ${isMe ? 'bg-[#00a884]' : 'bg-[#54656f]'} transition-all duration-100`} 
             style={{ width: `${progress}%` }}
           />
        </div>
        <span className="text-[11px] text-[#667781] mt-0.5">
           {formatTime(isPlaying ? audioRef.current?.currentTime || 0 : duration)}
        </span>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMe = message.sender === 'me';
  const isAudio = message.type === 'audio' && message.audioUrl;

  return (
    <div className={`flex w-full mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`
          rounded-lg px-2 py-1.5 relative shadow-sm text-[14.2px] leading-[19px] break-words
          ${isMe ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}
          ${isAudio ? 'min-w-[280px] pr-4' : 'max-w-[85%] md:max-w-[65%]'}
        `}
      >
        {/* Triangle for bubble tail */}
        <div className={`absolute top-0 w-0 h-0 border-[6px] border-transparent ${
          isMe 
            ? 'right-[-6px] border-t-[#d9fdd3] border-l-[#d9fdd3]' 
            : 'left-[-6px] border-t-white border-r-white'
        }`} />

        {isAudio ? (
          <AudioPlayer url={message.audioUrl!} isMe={isMe} />
        ) : (
          <span className="text-[#111b21] whitespace-pre-wrap">
            {message.text}
          </span>
        )}
        
        <div className={`flex justify-end items-end gap-1 ${isAudio ? 'mt-[-10px]' : 'mt-[-2px]'} ml-2 float-right h-4`}>
          <span className="text-[11px] text-[#667781] min-w-fit pt-1">
            {message.timestamp}
          </span>
          {isMe && (
            <span className={message.status === 'read' ? 'text-[#53bdeb]' : 'text-[#667781]'}>
              {message.status === 'read' ? <CheckCheck size={15} /> : <Check size={15} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
