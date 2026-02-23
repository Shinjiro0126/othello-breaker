'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';

type BGMType = 'top' | 'game' | 'break' | null;

interface AudioContextType {
  isMuted: boolean;
  volume: number;
  currentBGM: BGMType;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playBGM: (type: BGMType) => void;
  stopBGM: () => void;
  playEffect: (type: 'othello' | 'thunder') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const BGM_PATHS = {
  top: '/top.mp3',
  game: '/game.mp3',
  break: '/break.mp3',
} as const;

const EFFECT_PATHS = {
  othello: '/othello.mp3',
  thunder: '/thunder.mp3',
} as const;

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  // LocalStorageから設定を一度だけ読み込み
  const [settings] = useState(() => {
    if (typeof window === 'undefined') return { muted: false, volume: 0.3 };
    
    try {
      return {
        muted: localStorage.getItem('audioMuted') === 'true',
        volume: parseFloat(localStorage.getItem('audioVolume') || '0.3')
      };
    } catch (error) {
      console.error('Failed to load audio settings:', error);
      return { muted: false, volume: 0.3 };
    }
  });

  const [isMuted, setIsMuted] = useState(settings.muted);
  const [volume, setVolumeState] = useState(settings.volume);
  const [currentBGM, setCurrentBGM] = useState<BGMType>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const effectRef = useRef<HTMLAudioElement | null>(null);
  const pendingBGMRef = useRef<BGMType>(null);
  const currentBGMRef = useRef<BGMType>(null);
  const isMutedRef = useRef(isMuted);
  const volumeRef = useRef(volume);

  // Refを同期
  useEffect(() => {
    currentBGMRef.current = currentBGM;
    isMutedRef.current = isMuted;
    volumeRef.current = volume;
  }, [currentBGM, isMuted, volume]);

  // BGM音量とミュート状態の更新
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  // BGMの再生（依存配列最適化）
  const playBGM = useCallback((type: BGMType) => {
    // 同じBGMが既に再生中の場合、音楽が正常に再生されていれば何もしない
    if (type === currentBGMRef.current && bgmRef.current && !bgmRef.current.paused) {
      return;
    }

    // まず現在のBGMを更新して、重複呼び出しを防ぐ
    setCurrentBGM(type);

    // 既存のBGMを停止
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
      bgmRef.current.src = '';
      bgmRef.current = null;
    }

    // 新しいBGMを再生
    if (type) {
      const audio = new Audio(BGM_PATHS[type]);
      audio.loop = true;
      audio.volume = isMutedRef.current ? 0 : volumeRef.current;
      audio.play().then(() => {
        setAudioInitialized(true);
        pendingBGMRef.current = null;
      }).catch(err => {
        console.log('BGM playback failed (will retry on user interaction):', err);
        pendingBGMRef.current = type;
      });
      bgmRef.current = audio;
    }
  }, []);

  // BGMの停止
  const stopBGM = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
      bgmRef.current = null;
    }
    setCurrentBGM(null);
  }, []);

  // 効果音の再生（依存配列最適化）
  const playEffect = useCallback((type: 'othello' | 'thunder') => {
    // 初回クリック時にオーディオを初期化
    if (!audioInitialized) {
      setAudioInitialized(true);
      // 保留中のBGMがあれば再生
      if (pendingBGMRef.current) {
        const pendingType = pendingBGMRef.current;
        pendingBGMRef.current = null;
        setTimeout(() => {
          if (pendingType === currentBGMRef.current && bgmRef.current && !bgmRef.current.paused) return;
          setCurrentBGM(pendingType);
          if (pendingType) {
            const audio = new Audio(BGM_PATHS[pendingType]);
            audio.loop = true;
            audio.volume = isMutedRef.current ? 0 : volumeRef.current;
            audio.play().catch(console.error);
            bgmRef.current = audio;
          }
        }, 0);
      }
    }

    if (isMutedRef.current) return;

    const audio = new Audio(EFFECT_PATHS[type]);
    audio.volume = volumeRef.current;
    audio.play().catch(err => {
      console.log('Effect playback failed:', err);
    });
  }, [audioInitialized]);

  // ミュート切り替え
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('audioMuted', String(newValue));
        } catch (error) {
          console.error('Failed to save mute state:', error);
        }
      }
      return newValue;
    });
  }, []);

  // 音量設定（デバウンス）
  const saveVolumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    
    // デバウンス処理
    if (saveVolumeTimeoutRef.current) {
      clearTimeout(saveVolumeTimeoutRef.current);
    }
    
    saveVolumeTimeoutRef.current = setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('audioVolume', String(clampedVolume));
        } catch (error) {
          console.error('Failed to save volume:', error);
        }
      }
    }, 300);
  }, []);

  // クリーンアップ（メモリリーク対策）
  useEffect(() => {
    return () => {
      if (saveVolumeTimeoutRef.current) {
        clearTimeout(saveVolumeTimeoutRef.current);
      }
      
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.src = '';
        bgmRef.current = null;
      }
      
      if (effectRef.current) {
        effectRef.current.pause();
        effectRef.current.src = '';
        effectRef.current = null;
      }
    };
  }, []);

  const value: AudioContextType = {
    isMuted,
    volume,
    currentBGM,
    toggleMute,
    setVolume,
    playBGM,
    stopBGM,
    playEffect,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
