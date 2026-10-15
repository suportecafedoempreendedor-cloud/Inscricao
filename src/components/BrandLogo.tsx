import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'symbol' | 'badge';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  theme = 'dark',
  className = 'h-10',
}) => {
  const isLight = theme === 'light';
  const cafeTextColor = isLight ? '#111827' : '#F9FAFB';
  const doTextColor = isLight ? '#4B5563' : '#9CA3AF';
  const dividerColor = isLight ? '#D1D5DB' : '#374151';
  const edicaoTextColor = isLight ? '#1F2937' : '#D1D5DB';

  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="sym_grad7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B0764" />
            <stop offset="50%" stopColor="#701A75" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          <linearGradient id="sym_grad9" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#881337" />
            <stop offset="40%" stopColor="#BE123C" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
          <linearGradient id="sym_gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        {/* Stylized 7 */}
        <path
          d="M10 20 H70 L48 100 H28 L48 38 H10 Z"
          fill="url(#sym_grad7)"
        />
        {/* Yellow ribbon accent on 7 */}
        <path
          d="M28 80 C24 95 18 100 10 100 C15 90 22 75 28 65 Z"
          fill="url(#sym_gradGold)"
        />
        {/* Stylized 9 */}
        <path
          d="M110 20 C85 20 70 38 70 60 C70 82 85 100 110 100 C125 100 138 92 144 80 L144 100 H158 L158 20 H142 L142 38 C135 26 124 20 110 20 Z M112 40 C124 40 138 48 138 60 C138 74 124 82 112 82 C98 82 88 74 88 60 C88 48 98 40 112 40 Z"
          fill="url(#sym_grad9)"
        />
        {/* Yellow swoop inside 9 */}
        <path
          d="M92 78 C96 68 104 60 114 58 C110 65 104 74 98 82 Z"
          fill="url(#sym_gradGold)"
        />
        {/* Ordinal 'a' */}
        <text
          x="142"
          y="28"
          fill="#9333EA"
          fontSize="18"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          a
        </text>
        <line
          x1="142"
          y1="32"
          x2="154"
          y2="32"
          stroke="url(#sym_gradGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 680 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
        aria-label="79.ª Edição Café do Empreendedor"
      >
        <defs>
          <linearGradient id="logo_grad7" x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#31054E" />
            <stop offset="45%" stopColor="#581C87" />
            <stop offset="85%" stopColor="#831843" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          <linearGradient id="logo_grad9" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#881337" />
            <stop offset="40%" stopColor="#9F1239" />
            <stop offset="75%" stopColor="#BE123C" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
          <linearGradient id="logo_gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="80%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="logo_gradEmpreendedor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B0764" />
            <stop offset="25%" stopColor="#581C87" />
            <stop offset="65%" stopColor="#9F1239" />
            <stop offset="90%" stopColor="#BE123C" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
          {/* Subtle drop shadow */}
          <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 79 BRAND MARK */}
        <g filter="url(#logoShadow)">
          {/* 7 */}
          <path
            d="M25 40 H135 L96 150 H62 L94 65 H25 Z"
            fill="url(#logo_grad7)"
          />
          {/* 7 golden dynamic ribbon at base */}
          <path
            d="M62 120 C54 135 42 148 26 150 C38 138 48 122 56 102 Z"
            fill="url(#logo_gradGold)"
          />

          {/* 9 - 3D Ribbon Torus */}
          <path
            d="M175 40 C135 40 108 68 108 102 C108 136 135 158 175 158 C202 158 222 145 230 128 L230 156 H255 L255 40 H228 L228 68 C218 50 198 40 175 40 Z M180 66 C198 66 226 78 226 102 C226 124 200 134 180 134 C158 134 140 122 140 102 C140 82 158 66 180 66 Z"
            fill="url(#logo_grad9)"
          />
          {/* 9 Inner Gold Ribbon Wave */}
          <path
            d="M148 126 C155 110 168 98 184 94 C176 106 166 120 156 132 Z"
            fill="url(#logo_gradGold)"
          />
        </g>

        {/* Ordinal 'a' & 'EDIÇÃO' block */}
        <g transform="translate(258, 44)">
          <text
            x="0"
            y="26"
            fill="#9333EA"
            fontSize="32"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            a
          </text>
          <line
            x1="0"
            y1="33"
            x2="24"
            y2="33"
            stroke="url(#logo_gradGold)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text
            x="0"
            y="54"
            fill={edicaoTextColor}
            fontSize="13"
            fontWeight="600"
            letterSpacing="3"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            EDIÇÃO
          </text>
        </g>

        {/* Divider */}
        <line
          x1="322"
          y1="42"
          x2="322"
          y2="148"
          stroke={dividerColor}
          strokeWidth="1.5"
        />

        {/* Café do Empreendedor typography */}
        <g transform="translate(338, 40)">
          {/* Café */}
          <text
            x="0"
            y="56"
            fill={cafeTextColor}
            fontSize="58"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
            letterSpacing="-0.5"
          >
            Café
          </text>
          {/* do */}
          <text
            x="142"
            y="56"
            fill={doTextColor}
            fontSize="42"
            fontWeight="400"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            do
          </text>
          {/* Empreendedor */}
          <text
            x="0"
            y="112"
            fill="url(#logo_gradEmpreendedor)"
            fontSize="54"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
            letterSpacing="-1.2"
          >
            Empreendedor
          </text>
        </g>
      </svg>
    </div>
  );
};
