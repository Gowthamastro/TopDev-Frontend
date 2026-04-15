import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    imageStyle?: React.CSSProperties;
}

/**
 * Reusable Logo component for TopDev.
 * Uses the official logo image from the public directory.
 */
const Logo: React.FC<LogoProps> = ({ 
    size = 32, 
    className = '', 
    style = {},
    imageStyle = {}
}) => {
    return (
        <div 
            className={`${className}`} 
            style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                ...style 
            }}
        >
            <img 
                src="/logo.png" 
                alt="TopDev Logo" 
                style={{ 
                    height: size, 
                    width: 'auto', 
                    objectFit: 'contain',
                    ...imageStyle
                }} 
            />
        </div>
    );
};

export default Logo;
