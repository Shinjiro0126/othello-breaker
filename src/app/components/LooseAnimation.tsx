import Image from "next/image";

export function LooseAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center ${className}`} aria-label="cute robot cpu win animation">
      <Image
        src="/robot.svg"
        alt="CPUの勝利を表すイラスト"
        width={250}
        height={250}
        className="animate-pulse"
      />
    </div>
  );
}