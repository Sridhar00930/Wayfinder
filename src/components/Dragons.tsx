/**
 * "Here be dragons." Old maps drew dragons at the edge of the unknown.
 * For Wayfinder, the unknown is the health care system, and the app is the map.
 * Original line art, purely decorative: hidden from screen readers, ignored by
 * the pointer, and switched off in high contrast, reading mode, and print.
 */

function Dragon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 520 300" focusable="false" aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Bat-like wing, drawn first so the body overlaps it */}
        <path
          className="dragon-wing"
          d="M182 112 Q192 52 232 16 Q264 30 308 22 Q292 46 304 66 Q280 72 296 102 Q270 98 262 120 Q242 104 222 118 Q206 104 182 112 Z"
        />
        <path className="dragon-line" d="M232 16 L308 22 M232 16 L304 66 M232 16 L296 102 M232 16 L262 120 M232 16 L222 118" />

        {/* Serpent body: thick outline made of two strokes */}
        <path
          className="dragon-body-outer"
          d="M112 132 C150 92 200 92 232 130 S312 182 344 140 S404 92 434 130 S474 204 444 222 S398 214 410 190"
        />
        <path
          className="dragon-body-inner"
          d="M112 132 C150 92 200 92 232 130 S312 182 344 140 S404 92 434 130 S474 204 444 222 S398 214 410 190"
        />

        {/* Belly scales */}
        <path
          className="dragon-line"
          d="M150 118 q6 6 12 0 M178 112 q6 6 12 0 M206 116 q6 6 12 0 M252 148 q6 6 12 0 M282 160 q6 6 12 0 M312 160 q6 6 12 0 M368 120 q6 6 12 0 M398 112 q6 6 12 0 M428 132 q6 6 12 0"
        />

        {/* Spines along the back */}
        <path
          className="dragon-wing"
          d="M136 108 l6 -20 l10 14 z M160 98 l6 -20 l10 14 z M296 160 l8 -18 l8 14 z M322 152 l10 -16 l6 15 z M368 110 l8 -19 l8 14 z M394 102 l10 -17 l6 15 z M422 114 l12 -14 l3 16 z"
        />

        {/* Tail tip */}
        <path className="dragon-line" d="M410 190 l-14 -10 l4 16 l-12 6 l20 2 z" />

        {/* Legs and claws */}
        <path className="dragon-line" d="M172 124 l-8 30 l-10 4 M164 154 l2 8 M164 154 l8 6" />
        <path className="dragon-line" d="M352 150 l6 30 l-8 6 M358 180 l8 4 M358 180 l4 9" />

        {/* Head */}
        <path
          className="dragon-wing"
          d="M116 128 L96 108 L70 104 L40 110 L28 119 L58 126 L38 136 L62 145 L98 149 L116 140 Z"
        />
        <circle className="dragon-eye" cx="80" cy="117" r="3.4" />
        <path className="dragon-line" d="M96 108 Q104 80 130 68 M106 116 Q126 94 150 92" />
        <path className="dragon-line" d="M30 118 Q16 104 14 84 Q16 74 26 76 M40 138 Q24 156 26 176 Q30 186 40 182" />
        <path className="dragon-line" d="M58 126 l6 -5 l4 6 l5 -5 l4 6 l5 -5" />
        <path className="dragon-line" d="M112 120 l10 -8 l2 10 l10 -6 l0 10" />
      </g>
    </svg>
  );
}

function Compass({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" focusable="false" aria-hidden="true">
      <g fill="none" strokeLinejoin="round">
        <circle className="dragon-line" cx="100" cy="100" r="78" />
        <circle className="dragon-line" cx="100" cy="100" r="64" strokeDasharray="2 6" />
        <path className="dragon-wing" d="M100 14 L112 100 L100 186 L88 100 Z" />
        <path className="dragon-wing" d="M14 100 L100 88 L186 100 L100 112 Z" />
        <path className="dragon-line" d="M40 40 L104 96 M160 40 L104 104 M40 160 L96 104 M160 160 L96 96" />
        <text className="compass-n" x="100" y="10" textAnchor="middle">
          N
        </text>
      </g>
    </svg>
  );
}

export function Dragons() {
  return (
    <div className="dragons" aria-hidden="true">
      <Dragon className="dragon dragon-a" />
      <Dragon className="dragon dragon-b" />
      <Compass className="compass-rose" />
    </div>
  );
}
