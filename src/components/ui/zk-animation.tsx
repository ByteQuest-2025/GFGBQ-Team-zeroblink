"use client";

import { useEffect, useState } from "react";

interface ZKAnimationProps {
  progress: number;
  status: string;
}

export function ZKAnimation({ progress, status }: ZKAnimationProps) {
  const [nodes, setNodes] = useState<{ x: number; y: number; delay: number }[]>([]);
  const [connections, setConnections] = useState<{ from: number; to: number }[]>([]);

  useEffect(() => {
    // Generate circuit nodes
    const newNodes = [];
    for (let i = 0; i < 12; i++) {
      newNodes.push({
        x: 20 + (i % 4) * 60 + Math.random() * 20,
        y: 20 + Math.floor(i / 4) * 50 + Math.random() * 10,
        delay: i * 0.1,
      });
    }
    setNodes(newNodes);

    // Generate connections
    const newConnections = [];
    for (let i = 0; i < 8; i++) {
      newConnections.push({
        from: i,
        to: i + 4 > 11 ? i - 4 : i + 4,
      });
    }
    setConnections(newConnections);
  }, []);

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Outer glow ring */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent, rgba(34, 197, 94, ${progress / 100 * 0.5}), transparent)`,
          animation: "spin 3s linear infinite",
        }}
      />
      
      {/* Main container */}
      <div className="absolute inset-4 bg-dark-900/80 rounded-full border border-green-500/30 overflow-hidden">
        {/* Circuit visualization */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          {/* Connection lines */}
          {connections.map((conn, i) => {
            const from = nodes[conn.from];
            const to = nodes[conn.to];
            if (!from || !to) return null;
            
            const isActive = progress > (i / connections.length) * 100;
            
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? "#22c55e" : "#1a3a2a"}
                strokeWidth="1.5"
                className={isActive ? "animate-pulse" : ""}
                style={{
                  opacity: isActive ? 0.8 : 0.3,
                  transition: "all 0.5s ease",
                }}
              />
            );
          })}
          
          {/* Circuit nodes */}
          {nodes.map((node, i) => {
            const isActive = progress > (i / nodes.length) * 80;
            
            return (
              <g key={i}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 6 : 4}
                  fill={isActive ? "#22c55e" : "#0a1f15"}
                  stroke={isActive ? "#4ade80" : "#1a3a2a"}
                  strokeWidth="2"
                  style={{
                    transition: "all 0.3s ease",
                    transitionDelay: `${node.delay}s`,
                  }}
                />
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="10"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="1"
                    opacity="0.3"
                    className="animate-ping"
                    style={{ animationDelay: `${node.delay}s` }}
                  />
                )}
              </g>
            );
          })}
          
          {/* Center proof symbol */}
          <g transform="translate(100, 100)">
            <circle
              r={progress > 50 ? 25 : 20}
              fill="rgba(34, 197, 94, 0.2)"
              stroke="#22c55e"
              strokeWidth="2"
              className={progress > 50 ? "animate-pulse" : ""}
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#22c55e"
              fontSize="14"
              fontWeight="bold"
            >
              ZK
            </text>
          </g>
        </svg>
        
        {/* Scanning line effect */}
        <div 
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
          style={{
            top: `${(progress % 100)}%`,
            opacity: 0.6,
            transition: "top 0.1s linear",
          }}
        />
      </div>
      
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="128"
          cy="128"
          r="120"
          fill="none"
          stroke="#0a1f15"
          strokeWidth="4"
        />
        <circle
          cx="128"
          cy="128"
          r="120"
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 120}`}
          strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Floating particles */}
      {progress > 20 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
