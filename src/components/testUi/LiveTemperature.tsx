import { useState, useEffect } from "react";

export default function LiveTemperature({
  initialTemp,
}: {
  initialTemp: number;
}) {
  const [temp, setTemp] = useState(initialTemp);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemp((prev) => prev + (Math.random() - 0.5));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-blue-600">
          실시간 데이터 수신 중...
        </span>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      </div>
      <p className="text-4xl font-black text-slate-800 mt-2 font-mono">
        {temp.toFixed(1)} <span className="text-xl font-sans">°C</span>
      </p>
    </div>
  );
}
