"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

type BackgroundAudioContextType = {
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
};

const BackgroundAudioContext = createContext<BackgroundAudioContextType | null>(
  null,
);

const AUDIO_SRC = "/music/Mongolia%20Looped.wav";
const DEFAULT_VOLUME = 0.5; // 50% sound volume

export function BackgroundAudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const userManuallyPausedRef = useRef(false);
  const hasStartedRef = useRef(false);

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || userManuallyPausedRef.current || hasStartedRef.current) return;

    audio.volume = DEFAULT_VOLUME;
    audio.loop = true;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          hasStartedRef.current = true;
          setIsPlaying(true);
        })
        .catch(() => {
          // Playback failed (e.g. browser policy requires direct gesture like click)
          // We keep listeners active until a valid gesture triggers play
        });
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = DEFAULT_VOLUME;
      audio.loop = true;
    }

    const onUserInteraction = () => {
      if (!hasStartedRef.current && !userManuallyPausedRef.current) {
        attemptPlay();
      }
    };

    const events: (keyof WindowEventMap)[] = [
      "click",
      "pointerdown",
      "scroll",
      "wheel",
      "touchstart",
      "keydown",
    ];

    events.forEach((event) => {
      window.addEventListener(event, onUserInteraction, {
        passive: true,
        once: false,
      });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, onUserInteraction);
      });
    };
  }, [attemptPlay]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      userManuallyPausedRef.current = true;
      setIsPlaying(false);
    } else {
      userManuallyPausedRef.current = false;
      audio.volume = DEFAULT_VOLUME;
      audio.loop = true;
      audio
        .play()
        .then(() => {
          hasStartedRef.current = true;
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio play error:", err);
        });
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    userManuallyPausedRef.current = false;
    audio.volume = DEFAULT_VOLUME;
    audio.loop = true;
    audio
      .play()
      .then(() => {
        hasStartedRef.current = true;
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Audio play error:", err);
      });
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    userManuallyPausedRef.current = true;
    setIsPlaying(false);
  }, []);

  return (
    <BackgroundAudioContext.Provider
      value={{ isPlaying, togglePlay, play, pause }}
    >
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="auto"
        loop
        playsInline
      />
      {children}
    </BackgroundAudioContext.Provider>
  );
}

export function useBackgroundAudio() {
  const context = useContext(BackgroundAudioContext);
  if (!context) {
    throw new Error(
      "useBackgroundAudio must be used within a BackgroundAudioProvider",
    );
  }
  return context;
}

export function AudioToggle({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { isPlaying, togglePlay } = useBackgroundAudio();

  return (
    <button
      type="button"
      onClick={togglePlay}
      aria-label={
        isPlaying ? "Pause background music" : "Play background music"
      }
      title={isPlaying ? "Pause music" : "Play music"}
      className={cn(
        "group inline-flex items-center gap-2.5 border-b border-line-strong py-1.5",
        "font-sans text-meta uppercase text-text cursor-pointer",
        "transition-colors duration-(--duration-quick) hover:border-accent hover:text-accent-text",
        className,
      )}
    >
      {/* Equalizer Visualizer Bars */}
      <span
        aria-hidden
        className={cn(
          "flex h-4.5 items-end gap-[2.5px] pb-0.5",
          isPlaying ? "is-audio-playing text-accent-text" : "opacity-60",
        )}
      >
        <span className="u-audio-bar u-audio-bar-1" />
        <span className="u-audio-bar u-audio-bar-2" />
        <span className="u-audio-bar u-audio-bar-3" />
        <span className="u-audio-bar u-audio-bar-4" />
      </span>

      {showLabel ? (
        <span className="flex items-center gap-1.5">
          <span>Music</span>
          <span
            className={cn(
              "text-[10px] tracking-wider transition-colors duration-200",
              isPlaying ? "text-accent-text font-semibold" : "text-text-muted",
            )}
          >
            {isPlaying ? "ON" : "OFF"}
          </span>
        </span>
      ) : null}
    </button>
  );
}
