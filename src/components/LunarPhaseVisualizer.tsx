import React from 'react';
import { LunarPhaseKey } from '../types';

interface LunarPhaseVisualizerProps {
  phaseKey: LunarPhaseKey;
  illumination: number;
  phaseName: string;
  size?: number; // default 160
  className?: string;
  showOrbits?: boolean;
}

export const LunarPhaseVisualizer: React.FC<LunarPhaseVisualizerProps> = ({
  phaseKey,
  illumination,
  phaseName,
  size = 160,
  className = '',
  showOrbits = true
}) => {
  // Compute SVG terminator geometry
  // cx = 100, cy = 100, R = 56
  const R = 54;
  const cx = 100;
  const cy = 100;

  // Illumination ratio 0 to 1
  const illumRatio = Math.max(0, Math.min(100, illumination)) / 100;

  // Determine waxing vs waning
  const isWaxing =
    phaseKey === 'waxing_crescent' ||
    phaseKey === 'first_quarter' ||
    phaseKey === 'waxing_gibbous';
  const isFull = phaseKey === 'full_moon';
  const isNew = phaseKey === 'new_moon';

  // Semi-minor axis for terminator ellipse
  // rx varies from R (at 0% and 100%) to 0 (at 50%)
  const rx = Math.abs(R * (1 - 2 * illumRatio));

  // Determine path for illuminated zone
  // Top: (cx, cy - R) = (100, 46)
  // Bottom: (cx, cy + R) = (100, 154)
  let litPath = '';

  if (isNew) {
    litPath = '';
  } else if (isFull) {
    litPath = `M ${cx} ${cy - R} A ${R} ${R} 0 1 1 ${cx} ${cy + R} A ${R} ${R} 0 1 1 ${cx} ${cy - R} Z`;
  } else if (isWaxing) {
    // Waxing: right side is lit
    // Outer arc: from top (100, 46) around the right side down to bottom (100, 154)
    // Inner arc: along the terminator back to top
    if (illumination <= 50) {
      // Crescent: inner arc curves right (sweep-flag = 0)
      litPath = `M ${cx} ${cy - R} A ${R} ${R} 0 0 1 ${cx} ${cy + R} A ${rx} ${R} 0 0 0 ${cx} ${cy - R} Z`;
    } else {
      // Gibbous: inner arc bulges left into dark side (sweep-flag = 1)
      litPath = `M ${cx} ${cy - R} A ${R} ${R} 0 0 1 ${cx} ${cy + R} A ${rx} ${R} 0 0 1 ${cx} ${cy - R} Z`;
    }
  } else {
    // Waning: left side is lit
    if (illumination <= 50) {
      // Crescent: inner arc curves left
      litPath = `M ${cx} ${cy - R} A ${R} ${R} 0 0 0 ${cx} ${cy + R} A ${rx} ${R} 0 0 1 ${cx} ${cy - R} Z`;
    } else {
      // Gibbous: inner arc bulges right into dark side
      litPath = `M ${cx} ${cy - R} A ${R} ${R} 0 0 0 ${cx} ${cy + R} A ${rx} ${R} 0 0 0 ${cx} ${cy - R} Z`;
    }
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000 ease-out pointer-events-none"
        style={{
          background: isNew
            ? 'radial-gradient(circle, rgba(12,40,111,0.2) 0%, transparent 70%)'
            : isFull
            ? 'radial-gradient(circle, rgba(255,222,166,0.35) 0%, rgba(22,63,184,0.15) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(255,222,166,0.2) 0%, rgba(12,40,111,0.15) 50%, transparent 70%)'
        }}
      />

      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible drop-shadow-2xl"
        role="img"
        aria-label={`Current Lunar Phase: ${phaseName}, ${illumination}% illumination`}
      >
        <defs>
          {/* Lunar Dark Side / Earthshine Base Gradient */}
          <radialGradient id="earthshineGrad" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#1e2422" />
            <stop offset="70%" stopColor="#121615" />
            <stop offset="100%" stopColor="#0a0c0c" />
          </radialGradient>

          {/* Lunar Illuminated Surface Texture Gradient */}
          <radialGradient id="moonIllumGrad" cx="55%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#fff8e7" />
            <stop offset="35%" stopColor="#f7e7c4" />
            <stop offset="75%" stopColor="#e2c99b" />
            <stop offset="100%" stopColor="#bfa16f" />
          </radialGradient>

          {/* Atmospheric Corona Ring */}
          <radialGradient id="coronaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="transparent" />
            <stop offset="90%" stopColor="rgba(255, 222, 166, 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Clip path for the spherical moon disc */}
          <clipPath id="moonDiscClip">
            <circle cx={cx} cy={cy} r={R} />
          </clipPath>

          {/* Filter for lunar surface micro-grain */}
          <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit Ticks and Celestial Markings */}
        {showOrbits && (
          <g className="text-[#5b625e] opacity-60">
            {/* Outer coordinate ring */}
            <circle
              cx={cx}
              cy={cy}
              r="76"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeDasharray="2 4"
            />
            <circle
              cx={cx}
              cy={cy}
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />

            {/* 12 Celestial Hour Ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = cx + 80 * Math.cos(rad);
              const y1 = cy + 80 * Math.sin(rad);
              const x2 = cx + 85 * Math.cos(rad);
              const y2 = cy + 85 * Math.sin(rad);
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={deg % 90 === 0 ? '#ffdea6' : '#abb3af'}
                  strokeWidth={deg % 90 === 0 ? '1.5' : '0.75'}
                  strokeOpacity={deg % 90 === 0 ? '0.8' : '0.4'}
                />
              );
            })}

            {/* Cardinal Markers */}
            <text x={cx} y="18" fill="#abb3af" fontSize="7" fontFamily="monospace" textAnchor="middle">0° N</text>
            <text x="194" y="102" fill="#abb3af" fontSize="7" fontFamily="monospace" textAnchor="start">90° E</text>
            <text x={cx} y="196" fill="#abb3af" fontSize="7" fontFamily="monospace" textAnchor="middle">180° S</text>
            <text x="6" y="102" fill="#abb3af" fontSize="7" fontFamily="monospace" textAnchor="end">270° W</text>
          </g>
        )}

        {/* Ambient Moon Corona Ring */}
        <circle
          cx={cx}
          cy={cy}
          r={R + 6}
          fill="none"
          stroke="url(#coronaGrad)"
          strokeWidth="6"
          className="transition-all duration-700"
          style={{ opacity: isNew ? 0.2 : (illumination / 100) * 0.8 + 0.2 }}
        />

        {/* Moon Body: Base Dark Sphere (Earthshine) */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="url(#earthshineGrad)"
          stroke="#3b423f"
          strokeWidth="0.8"
        />

        {/* Mare Craters on the Dark Disc (Faint Earthshine Maria) */}
        <g clipPath="url(#moonDiscClip)" opacity="0.45">
          <ellipse cx="82" cy="85" rx="14" ry="11" fill="#131716" />
          <ellipse cx="112" cy="78" rx="12" ry="9" fill="#141817" />
          <ellipse cx="94" cy="115" rx="18" ry="14" fill="#111413" />
          <circle cx="75" cy="120" r="5" fill="#0f1211" />
          <circle cx="120" cy="112" r="7" fill="#131716" />
        </g>

        {/* Dynamic Illuminated Phase Path with Smooth Transition */}
        {litPath && (
          <g clipPath="url(#moonDiscClip)">
            <path
              d={litPath}
              fill="url(#moonIllumGrad)"
              className="transition-all duration-700 ease-out"
              filter="url(#moonGlow)"
            />

            {/* Realistic Maria (Lunar Seas) on the illuminated face */}
            <g opacity="0.22" className="transition-opacity duration-700 pointer-events-none">
              {/* Mare Tranquillitatis & Serenitatis */}
              <ellipse cx="115" cy="80" rx="13" ry="10" fill="#7a6742" />
              <ellipse cx="106" cy="94" rx="11" ry="8" fill="#7a6742" />
              {/* Oceanus Procellarum */}
              <ellipse cx="78" cy="88" rx="16" ry="14" fill="#7a6742" />
              {/* Mare Imbrium */}
              <ellipse cx="88" cy="68" rx="12" ry="10" fill="#7a6742" />
              {/* Mare Nubium & Humorum */}
              <ellipse cx="92" cy="120" rx="14" ry="11" fill="#7a6742" />
              {/* Tycho crater with ray star */}
              <circle cx="98" cy="136" r="3.5" fill="#fffcee" opacity="0.7" />
              <line x1="98" y1="136" x2="82" y2="124" stroke="#fffcee" strokeWidth="0.5" opacity="0.4" />
              <line x1="98" y1="136" x2="114" y2="126" stroke="#fffcee" strokeWidth="0.5" opacity="0.4" />
              <line x1="98" y1="136" x2="102" y2="148" stroke="#fffcee" strokeWidth="0.5" opacity="0.4" />
            </g>

            {/* Terminator Soft Transition Scrim */}
            <path
              d={litPath}
              fill="none"
              stroke="#bfa16f"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              className="transition-all duration-700"
            />
          </g>
        )}

        {/* Outer Rim Highlight Ring */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={isNew ? '#3154cb' : '#ffdea6'}
          strokeWidth="0.75"
          strokeOpacity={isNew ? '0.3' : '0.6'}
          className="transition-all duration-700"
        />

        {/* Center Crosshair Sub-element */}
        <circle cx={cx} cy={cy} r="1.5" fill="#ffdea6" opacity="0.6" />
      </svg>
    </div>
  );
};
