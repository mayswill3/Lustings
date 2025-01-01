// Avatar.tsx
import React from 'react';
import classNames from 'classnames';

interface AvatarProps {
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ size = 'medium', children, className }) => {
    const avatarClasses = classNames(
        'inline-flex items-center justify-center rounded-full overflow-hidden',
        {
            'w-8 h-8': size === 'small',
            'w-12 h-12': size === 'medium',
            'w-16 h-16': size === 'large',
        },
        className
    );

    return <div className={avatarClasses}>{children}</div>;
};

// AvatarImage.tsx
interface AvatarImageProps {
    src: string;
    alt: string;
    className?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, className }) => {
    return <img src={src} alt={alt} className={classNames('object-cover w-full h-full', className)} />;
};

// AvatarFallback.tsx
interface AvatarFallbackProps {
    children: React.ReactNode;  // Changed from fallbackText to children
    className?: string;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className }) => {
    return (
        <div
            className={classNames(
                'flex items-center justify-center bg-gray-200 text-gray-700 w-full h-full',
                className
            )}
        >
            {children}
        </div>
    );
};


