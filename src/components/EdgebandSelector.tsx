import { EdgeBanding } from '../types';

interface Props {
  edges: EdgeBanding;
  onChange: (edges: EdgeBanding) => void;
}

export function EdgebandSelector({ edges, onChange }: Props) {
  const toggle = (side: keyof EdgeBanding) => {
    onChange({ ...edges, [side]: edges[side] === 0 ? 4 : 0 }); // 4 represent 0.4mm or generic thick edge representation
  };

  const baseClasses = "absolute transition-colors duration-200 cursor-pointer hover:bg-blue-400";
  const activeColor = "bg-blue-500 shadow-[0_0_5px_#3b82f6]";
  const inactiveColor = "bg-slate-700/50 hover:bg-blue-400/50";

  return (
    <div className="relative w-6 h-6 border border-slate-700 bg-slate-900 rounded-[3px] shadow-inner overflow-hidden">
      {/* Top */}
      <div onClick={() => toggle('top')} className={`${baseClasses} top-0 left-0 right-0 h-1.5 rounded-t-sm ${edges.top ? activeColor : inactiveColor}`} />
      
      {/* Bottom */}
      <div onClick={() => toggle('bottom')} className={`${baseClasses} bottom-0 left-0 right-0 h-1.5 rounded-b-sm ${edges.bottom ? activeColor : inactiveColor}`} />
      
      {/* Left */}
      <div onClick={() => toggle('left')} className={`${baseClasses} left-0 top-0 bottom-0 w-1.5 rounded-l-sm ${edges.left ? activeColor : inactiveColor}`} />
      
      {/* Right */}
      <div onClick={() => toggle('right')} className={`${baseClasses} right-0 top-0 bottom-0 w-1.5 rounded-r-sm ${edges.right ? activeColor : inactiveColor}`} />
    </div>
  );
}
