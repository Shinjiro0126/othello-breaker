'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';

type BGMType = 'top' | 'game' | 'break' | null;

interface AudioContextType {
  isMuted: boolean;
  volume: number;
  currentBGM: BGMType;
  isIOS: boolean;
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
  // SSRとクライアントの初期表示を一致させるため、初期値は必ず固定値にする
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const [currentBGM, setCurrentBGM] = useState<BGMType>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const effectRef = useRef<HTMLAudioElement | null>(null);
  const pendingBGMRef = useRef<BGMType>(null);
  const currentBGMRef = useRef<BGMType>(null);
  const isMutedRef = useRef(isMuted);
  const volumeRef = useRef(volume);
  const isIOSRef = useRef(false);

  // マウント後にのlocalStorageから設定を読み込む（SSRとハイドレーションを分離する）
  useEffect(() => {
    try {
      const savedMuted = localStorage.getItem('audioMuted') === 'true';
      const savedVolume = parseFloat(localStorage.getItem('audioVolume') || '0.3');
      if (savedMuted !== isMutedRef.current) {
        isMutedRef.current = savedMuted;
        setIsMuted(savedMuted);
      }
      if (savedVolume !== volumeRef.current) {
        volumeRef.current = savedVolume;
        setVolumeState(savedVolume);
      }
    } catch (error) {
      console.error('Failed to load audio settings:', error);
    }
  }, []);

  // iOS判定（audio.volumeが効かないデバイスを検出）
  useEffect(() => {
    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    isIOSRef.current = ios;
    setIsIOS(ios);
  }, []);

  // BGMのRefのみ同期（isMuted/volumeはtoggleMute/setVolumeで直接更新）
  useEffect(() => {
    currentBGMRef.current = currentBGM;
  }, [currentBGM]);

  // BGM音量とミュート状態の更新（フォールバック）
  useEffect(() => {
    if (bgmRef.current) {
      if (isIOSRef.current) {
        // iOSはvolumeが読み取り専用のためmutedを使用
        bgmRef.current.muted = isMuted;
      } else {
        bgmRef.current.volume = isMuted ? 0 : volume;
      }
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
      if (isIOSRef.current) {
        audio.muted = isMutedRef.current;
      } else {
        audio.volume = isMutedRef.current ? 0 : volumeRef.current;
      }
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
            if (isIOSRef.current) {
              audio.muted = isMutedRef.current;
            } else {
              audio.volume = isMutedRef.current ? 0 : volumeRef.current;
            }
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

  // ミュート切り替え（Refとbgmへ即時反映）
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      // Refを即時更新
      isMutedRef.current = newValue;
      // 再生中のBGMに即時反映
      if (bgmRef.current) {
        if (isIOSRef.current) {
          bgmRef.current.muted = newValue;
        } else {
          bgmRef.current.volume = newValue ? 0 : volumeRef.current;
        }
      }
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

  // 音量設定（Refとbgmへ即時反映、localStorage保存はデバウンス）
  const saveVolumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setVolume = useCallback((newVolume: number) => {
    if (isIOSRef.current) return; // iOSはvolumeが効かないためスキップ
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    // Refを即時更新
    volumeRef.current = clampedVolume;
    // 再生中のBGMに即時反映（ミュート中でなければ）
    if (bgmRef.current && !isMutedRef.current) {
      bgmRef.current.volume = clampedVolume;
    }
    setVolumeState(clampedVolume);
    
    // デバウンスでlocalStorage保存
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

  // タブが非表示になったらBGMを停止、戻ったら再開
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!bgmRef.current) return;

      if (document.hidden) {
        bgmRef.current.pause();
      } else {
        if (!isMutedRef.current) {
          bgmRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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
    isIOS,
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
