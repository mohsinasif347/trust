"use client";
import { useState, useRef } from "react";
import { LucideIcon } from "lucide-react";

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

export default function NeonInput({
  label,
  icon: Icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  required,
  ...props
}: NeonInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<any>(null);

  const handleKeyDown = (e: any) => {
    setIsTyping(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // 300ms baad wapis seedha ghumay ga
    timerRef.current = setTimeout(() => setIsTyping(false), 300);

    if (props.onKeyDown) props.onKeyDown(e);
  };

  return (
    <div className="w-full mb-5 group">
      {/* Label */}
      <div className="flex justify-between items-center ml-1 mb-2">
        <label
          className={`text-[10px] font-bold uppercase tracking-[2px] transition-colors duration-300 ${
            isFocused ? "text-emerald-400" : "text-slate-500"
          }`}
        >
          {label}
        </label>
      </div>

      {/* --- Main Container --- */}
      <div className="relative rounded-xl overflow-hidden p-[1.5px]"> {/* p-[1.5px] border ki thickness hai */}
        
        {/* 1. Spinning Gradient Layer (Peechay wala ghoomne wala parda) 
           Sirf tab dikhay ga jab focus ho.
        */}
        <div
          className={`absolute inset-[-100%] transition-opacity duration-300 ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `conic-gradient(from 0deg, #10b981, #0ea5e9, #d946ef, #f59e0b, #10b981)`,
            // Typing = Tez + Anti-clockwise (reverse) | Normal = Slow + Clockwise
            animation: isTyping 
              ? "spin 1.5s linear infinite reverse" 
              : "spin 4s linear infinite",
          }}
        />

        {/* 2. Solid Background Layer (Mask)
           Ye beech mein aa kar "Fan" effect ko chupa dega.
        */}
        <div className="absolute inset-[1px] bg-[#09090b] rounded-[10px] z-0" />

        {/* 3. Actual Input & Icon (Sabse Upar)
        */}
        <div className="relative z-10 flex items-center bg-transparent rounded-[10px]">
          {Icon && (
            <div
              className={`pl-4 transition-colors duration-300 ${
                isFocused ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              <Icon size={18} />
            </div>
          )}

          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={(e) => {
              setIsFocused(false);
              setIsTyping(false);
              if (onBlur) onBlur(e);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            required={required}
            className={`w-full bg-transparent text-white py-4 pr-4 outline-none placeholder:text-slate-600 text-sm font-medium transition-all ${
              Icon ? "pl-3" : "pl-4"
            }`}
            autoComplete="off"
            {...props}
          />
        </div>
      </div>

      {/* --- Global CSS Animation --- */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}