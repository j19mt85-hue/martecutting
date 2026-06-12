import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import React, { ReactNode, useRef } from 'react';
import { BarChart3, Database, Layers, TrendingUp } from 'lucide-react';
import { MetricsWidget } from './MetricsWidget';

const TiltCard: React.FC<{ title: string; value: string; icon: ReactNode; delay: number }> = ({ title, value, icon, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring", bounce: 0.4 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative flex flex-col justify-between p-6 h-40 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-colors"
    >
      {/* 3D Depth Decorator Layer */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br from-white/[0.03] to-transparent"
        style={{ transform: "translateZ(20px)" }}
      />
      
      {/* Content pulled forward on the Z axis for parallax */}
      <div className="flex items-center justify-between" style={{ transform: "translateZ(40px)" }}>
        <h3 className="text-sm font-semibold text-slate-400">{title}</h3>
        <div className="p-2 bg-slate-800/80 rounded-lg text-blue-400 border border-slate-700/50 shadow-inner">
          {icon}
        </div>
      </div>

      <div style={{ transform: "translateZ(60px)" }}>
        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight">
          {value}
        </span>
      </div>
    </motion.div>
  );
};

export function DashboardGrid() {
  const cards = [
    { title: "აქტიური პროექტები", value: "14", icon: <Layers className="w-5 h-5" /> },
    { title: "ამ თვის სიმძლავრე", value: "86.4%", icon: <TrendingUp className="w-5 h-5" /> },
    { title: "ნარჩენი საწყობში", value: "128", icon: <Database className="w-5 h-5" /> },
    { title: "დაზოგილი ხარჯი", value: "1,240 ₾", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full max-w-5xl mb-8 relative z-20" style={{ perspective: "1000px" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <TiltCard 
            key={idx} 
            title={card.title} 
            value={card.value} 
            icon={card.icon} 
            delay={idx * 0.1} 
          />
        ))}
        {/* Real-time Trend Widget */}
        <MetricsWidget />
      </div>
    </div>
  );
}
