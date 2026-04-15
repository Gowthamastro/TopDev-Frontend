import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
    /** Height of the logo in pixels. Default is 36. */
    size?: number;
    /** Whether to only show the icon (</>). Default is false. */
    iconOnly?: boolean;
    /** Whether to apply mix-blend-mode: difference for adaptive coloring on any background. */
    adaptive?: boolean;
    /** Optional additional class names. */
    className?: string;
    /** Optional inline styles for the container. */
    style?: React.CSSProperties;
    /** Link destination. Default is '/'. Set to null to disable the link. */
    to?: string | null;
}

/**
 * Premium Dynamic TopDev Logo
 * - Pure SVG for sharp rendering and CSS-driven styling.
 * - Adaptive coloring via currentColor or optional mix-blend-mode.
 * - Responsive: Hides text on mobile/small screens.
 * - Premium hover effects and glow.
 */
const Logo: React.FC<LogoProps> = ({ 
    size = 36, 
    iconOnly = false,
    adaptive = false,
    className = '', 
    style = {},
    to = '/'
}) => {
    const content = (
        <div 
            className={`topdev-logo-container ${className}`} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center',
                height: size,
                transition: 'transform 150ms ease-out',
                cursor: 'pointer',
                mixBlendMode: adaptive ? 'difference' : 'unset',
                ...style 
            }}
        >
            <style>{`
                .topdev-logo-container:hover {
                    transform: scale(1.03);
                }
                .topdev-logo-svg {
                    height: 100%;
                    width: auto;
                    display: block;
                }
                .topdev-logo-text {
                    font-family: 'Manrope', 'Inter', sans-serif;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    fill: var(--color-text);
                    pointer-events: none;
                }
                .topdev-logo-icon {
                    fill: none;
                    stroke: currentColor;
                    stroke-width: 2.5;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }
                
                @media (max-width: 768px) {
                    .topdev-logo-text {
                        display: none;
                    }
                }
            `}</style>
            
            <svg 
                viewBox="0 0 135 40" 
                className="topdev-logo-svg"
                preserveAspectRatio="xMidYMid meet"
                style={{ height: size }}
            >
                {/* Icon: </> */}
                <g className="topdev-logo-icon">
                    <path d="M15 12 L8 20 L15 28" />
                    <path d="M25 12 L32 20 L25 28" />
                    <line x1="23" y1="10" x2="17" y2="30" />
                </g>
                
                {/* Text: TopDev */}
                {!iconOnly && (
                    <text 
                        x="42" 
                        y="26" 
                        className="topdev-logo-text"
                        style={{ fontSize: 22 }}
                    >
                        TopDev
                    </text>
                )}
            </svg>
        </div>
    );

    if (to) {
        return <Link to={to} style={{ textDecoration: 'none', display: 'inline-flex' }}>{content}</Link>;
    }

    return content;
};

export default Logo;
