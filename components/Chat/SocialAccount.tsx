import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub, FaLinkedin, FaTiktok, FaYoutube, FaGlobe } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';

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
    text: string,
    hover: string,
    icon: string,
    gradient: string
}> = {
    instagram: {
        text: 'text-pink-600',
        hover: 'hover:bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 hover:text-white',
        icon: 'text-pink-600',
        gradient: 'bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500'
    },
    twitter: {
        text: 'text-blue-500',
        hover: 'hover:bg-blue-500 hover:text-white',
        icon: 'text-blue-500 group-hover:text-white',
        gradient: 'bg-blue-500'
    },
    facebook: {
        text: 'text-blue-600',
        hover: 'hover:bg-blue-600 hover:text-white',
        icon: 'text-blue-600 group-hover:text-white',
        gradient: 'bg-blue-600'
    },
    github: {
        text: 'text-gray-800',
        hover: 'hover:bg-gray-800 hover:text-white',
        icon: 'text-gray-800 group-hover:text-white',
        gradient: 'bg-gray-800'
    },
    linkedin: {
        text: 'text-blue-700',
        hover: 'hover:bg-blue-700 hover:text-white',
        icon: 'text-blue-700 group-hover:text-white',
        gradient: 'bg-blue-700'
    },
    youtube: {
        text: 'text-red-500',
        hover: 'hover:bg-red-500 hover:text-white',
        icon: 'text-red-500 group-hover:text-white',
        gradient: 'bg-red-500'
    },
    tiktok: {
        text: 'text-black',
        hover: 'hover:bg-black hover:text-white',
        icon: 'text-black group-hover:text-white',
        gradient: 'bg-black'
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
        text: 'text-gray-600',
        hover: 'hover:bg-gray-600 hover:text-white',
        icon: 'text-gray-600 group-hover:text-white',
        gradient: 'bg-gray-600'
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
        <span ref={rendererRef} className="inline-flex items-center gap-1 group my-1 select-none">
            <button
                onClick={handleClick}
                className={cn("inline-flex items-center gap-2 px-2 py-1 rounded-full border transition-all duration-300 hover:border-transparent", styles.hover, styles.text)}
            >
                {Icon && <Icon className={`w-4 h-4 ${styles.icon}`} />}
                <span className="font-medium text-sm">@{username}</span>
            </button>
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