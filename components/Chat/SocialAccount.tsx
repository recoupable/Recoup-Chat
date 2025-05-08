import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub, FaLinkedin, FaTiktok, FaYoutube, FaGlobe } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import { Badge } from '@/components/ui/badge';

interface SocialAccountProps {
    username: string;
    platform: string;
}

interface SocialAccountInfo {
    username: string;
    platform: string;
}

const platformIcons: Record<string, IconType> = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    instagram: FaInstagram,
    github: FaGithub,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
    tiktok: FaTiktok,
    default: FaGlobe, // Default icon for unknown platforms
};

const platformStyles: Record<string, {
    icon: string,
    hoverClass: string
}> = {
    instagram: {
        icon: 'text-pink-600',
        hoverClass: 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200'
    },
    twitter: {
        icon: 'text-blue-500',
        hoverClass: 'hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200'
    },
    facebook: {
        icon: 'text-blue-600',
        hoverClass: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
    },
    github: {
        icon: 'text-gray-800',
        hoverClass: 'hover:bg-gray-50 hover:text-gray-800 hover:border-gray-200'
    },
    linkedin: {
        icon: 'text-blue-700',
        hoverClass: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
    },
    youtube: {
        icon: 'text-red-500',
        hoverClass: 'hover:bg-red-50 hover:text-red-500 hover:border-red-200'
    },
    tiktok: {
        icon: 'text-black',
        hoverClass: 'hover:bg-gray-50 hover:text-black hover:border-gray-200'
    }
};

const platformUrls: Record<string, string> = {
    facebook: 'https://facebook.com/',
    twitter: 'https://twitter.com/',
    instagram: 'https://instagram.com/',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
    youtube: 'https://youtube.com/@',
    tiktok: 'https://tiktok.com/@',
};

const SocialAccount: React.FC<SocialAccountProps> & {
    parse: (text: string) => SocialAccountInfo | null;
} = ({ username, platform }) => {
    const rendererRef = useRef<HTMLSpanElement>(null);
    const normalizedPlatform = platform.toLowerCase();
    const Icon = platformIcons[normalizedPlatform] || platformIcons.default;
    const styles = platformStyles[normalizedPlatform] || {
        icon: 'text-gray-500',
        hoverClass: 'hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200'
    };
    const baseUrl = platformUrls[normalizedPlatform];

    useEffect(() => {
        if (rendererRef.current) {
            const parent = rendererRef.current.parentElement;
            if (parent) {
                parent.style.padding = '0px';
                parent.style.margin = '0px';
                parent.style.borderRadius = '0px';
                parent.style.backgroundColor = 'transparent';
                parent.style.border = 'none';
                parent.style.display = 'inline-flex';
                parent.style.alignItems = 'center';
                parent.style.gap = '0px';
            }
        }
    }, [rendererRef]);

    const handleClick = () => {
        if (baseUrl) {
            window.open(baseUrl + username, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <span ref={rendererRef} className="inline-flex items-center gap-1 my-1 select-none mx-1">
            <Badge 
                // variant="outline" 
                className={cn(
                    "rounded-full cursor-pointer px-2 py-0.5 text-xs font-normal bg-transparent border-gray-200 text-gray-600 ",
                    styles.hoverClass,
                    "transition-colors duration-200"
                )}
                onClick={handleClick}
            >
                {Icon && <Icon className={cn("w-3 h-3 mr-1", styles.icon)} />}
                @{username}
            </Badge>
        </span>
    );
};

// Static parse method
SocialAccount.parse = (text: string): SocialAccountInfo | null => {
    // Match @username with any characters except spaces and parentheses, followed by platform in parentheses
    // Also captures any additional text after the platform as comment
    const match = text.match(/^@([^\s()]+)\s*\(([^)]+)\)(.*)$/);
    if (!match) return null;
    
    return {
        username: match[1],
        platform: match[2].trim(),
    };
};

export default SocialAccount; 