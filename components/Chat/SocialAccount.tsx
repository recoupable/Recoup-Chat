import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';

interface SocialAccountProps {
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
};

const platformColors: Record<string, string> = {
    facebook: 'text-blue-600',
    twitter: 'text-blue-400',
    instagram: 'text-pink-500',
    github: 'text-gray-800',
    linkedin: 'text-blue-700',
    youtube: 'text-red-500',
    tiktok: 'text-black',
};

const SocialAccount: React.FC<SocialAccountProps> = ({ username, platform }) => {
    const normalizedPlatform = platform.toLowerCase();
    const Icon = platformIcons[normalizedPlatform];
    const colorClass = platformColors[normalizedPlatform] || 'text-gray-600';

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md">
            {Icon && <Icon className={`${colorClass} w-4 h-4`} />}
            <span className="font-medium">@{username}</span>
            <span className="text-gray-500">({platform})</span>
        </span>
    );
};

export default SocialAccount; 