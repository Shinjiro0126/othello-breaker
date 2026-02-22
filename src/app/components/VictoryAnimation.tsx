import Image from 'next/image';

// どこか適当なファイルに追加（同じコンポーネント内でもOK）
export default function VictoryAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`} aria-label="victory animation">
      <Image
              src="/men.png"
              alt="CPUの勝利を表すイラスト"
              width={250}
              height={250}
              className="animate-pulse"
            />
    </div>
  );
};