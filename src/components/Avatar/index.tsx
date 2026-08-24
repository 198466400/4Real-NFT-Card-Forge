import React from 'react';
import { motion } from 'framer-motion';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  shape?: 'circle' | 'square' | 'rounded';
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'md',
  status,
  shape = 'circle',
  className = '',
  onClick
}) => {
  const dimensions = sizeMap[size];
  const hasImage = !!src;
  const showName = !hasImage && !!name;

  // Generate initials from name
  const getInitials = () => {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Generate background color from name
  const getBackgroundColor = () => {
    if (!name) return 'var(--color-primary-500)';
    
    const colors = [
      'var(--color-primary-500)',
      'var(--color-secondary-500)',
      'var(--color-accent-500)',
      'var(--color-success-500)',
      'var(--color-warning-500)',
      'var(--color-error-500)',
      'var(--color-info-500)'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const shapeClass = {
    circle: 'avatar-circle',
    square: 'avatar-square',
    rounded: 'avatar-rounded'
  }[shape];

  const avatarClassName = [
    'avatar',
    `avatar-${size}`,
    shapeClass,
    onClick ? 'avatar-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={avatarClassName}
      style={{ width: dimensions, height: dimensions }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {hasImage ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="avatar-img"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div 
          className="avatar-placeholder"
          style={{ background: getBackgroundColor() }}
        >
          {showName && <span className="avatar-initials">{getInitials()}</span>}
        </div>
      )}
      
      {status && (
        <span className={`avatar-status avatar-status-${status}`} />
      )}
    </motion.div>
  );
};

// Avatar Group component
export interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = 'md',
  className = ''
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const hiddenCount = avatars.length - max;

  return (
    <div className={`avatar-group ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <motion.div
          key={avatar.src || avatar.name || index}
          style={{ marginLeft: index > 0 ? -8 : 0, zIndex: max - index }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Avatar {...avatar} size={size} />
        </motion.div>
      ))}
      
      {hiddenCount > 0 && (
        <motion.div
          className="avatar-more"
          style={{ marginLeft: -8, zIndex: 0 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: max * 0.05 }}
        >
          <Avatar
            name={`+${hiddenCount}`}
            size={size}
            shape="circle"
          />
        </motion.div>
      )}
    </div>
  );
};

// User Avatar component
export interface UserAvatarProps {
  user: {
    id: string;
    name?: string;
    avatar?: string;
    status?: AvatarProps['status'];
  };
  size?: AvatarProps['size'];
  shape?: AvatarProps['shape'];
  className?: string;
  onClick?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  shape = 'circle',
  className = '',
  onClick
}) => {
  return (
    <Avatar
      src={user.avatar}
      alt={user.name || `User ${user.id}`}
      name={user.name}
      size={size}
      status={user.status}
      shape={shape}
      className={className}
      onClick={onClick}
    />
  );
};

export default Avatar;
