import Image from "next/image";

export function LooseAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center ${className}`} aria-label="cute robot cpu win animation">
      <Image
        src="/robot.svg"
        alt="CPUの勝利を表すイラスト"
        width={200}
        height={200}
        className="animate-pulse w-24 h-24 sm:w-[200px] sm:h-[200px]"
      />
    </div>
  );
}