import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  background?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  interactive = false,
  hoverable = false,
  padding = 'md',
  shadow = 'sm',
  border = true,
  background = 'var(--bg-secondary)'
}) => {
  const handleClick = () => {
    if (onClick && !interactive) {
      onClick();
    }
  };

  const paddingClass = {
    none: '',
    sm: 'card-padding-sm',
    md: 'card-padding-md',
    lg: 'card-padding-lg'
  }[padding];

  const shadowClass = {
    none: '',
    sm: 'card-shadow-sm',
    md: 'card-shadow-md',
    lg: 'card-shadow-lg',
    xl: 'card-shadow-xl'
  }[shadow];

  const cardClassName = [
    'card',
    paddingClass,
    shadowClass,
    border ? 'card-border' : 'card-no-border',
    hoverable ? 'card-hoverable' : '',
    interactive ? 'card-interactive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={cardClassName}
      onClick={handleClick}
      whileHover={hoverable ? { y: -2, scale: 1.01 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      style={{ background }}
    >
      {children}
    </motion.div>
  );
};

// Card Header component
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  border = true,
  padding = 'md'
}) => {
  const paddingClass = {
    none: '',
    sm: 'card-header-padding-sm',
    md: 'card-header-padding-md',
    lg: 'card-header-padding-lg'
  }[padding];

  return (
    <div className={`card-header ${paddingClass} ${border ? 'card-header-border' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Card Body component
export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
  padding = 'md'
}) => {
  const paddingClass = {
    none: '',
    sm: 'card-body-padding-sm',
    md: 'card-body-padding-md',
    lg: 'card-body-padding-lg'
  }[padding];

  return (
    <div className={`card-body ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

// Card Footer component
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  border = true,
  padding = 'md'
}) => {
  const paddingClass = {
    none: '',
    sm: 'card-footer-padding-sm',
    md: 'card-footer-padding-md',
    lg: 'card-footer-padding-lg'
  }[padding];

  return (
    <div className={`card-footer ${paddingClass} ${border ? 'card-footer-border' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Card Title component
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  level = 3
}) => {
  const Heading = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Heading className={`card-title ${className}`}>
      {children}
    </Heading>
  );
};

// Card Subtitle component
export interface CardSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardSubtitle: React.FC<CardSubtitleProps> = ({
  children,
  className = ''
}) => {
  return (
    <p className={`card-subtitle ${className}`}>
      {children}
    </p>
  );
};

// Card Actions component
export interface CardActionsProps {
  children: React.ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardActions: React.FC<CardActionsProps> = ({
  children,
  className = '',
  justify = 'end',
  gap = 'md'
}) => {
  const justifyClass = {
    start: 'card-actions-justify-start',
    center: 'card-actions-justify-center',
    end: 'card-actions-justify-end',
    between: 'card-actions-justify-between',
    around: 'card-actions-justify-around'
  }[justify];

  const gapClass = {
    none: '',
    sm: 'card-actions-gap-sm',
    md: 'card-actions-gap-md',
    lg: 'card-actions-gap-lg'
  }[gap];

  return (
    <div className={`card-actions ${justifyClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

// Card Image component
export interface CardImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  fit?: 'cover' | 'contain' | 'fill';
  position?: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt = '',
  className = '',
  width,
  height,
  fit = 'cover',
  position = 'center'
}) => {
  return (
    <motion.div
      className={`card-image ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width,
        height,
        backgroundImage: `url(${src})`,
        backgroundSize: fit,
        backgroundPosition: position,
        backgroundRepeat: 'no-repeat'
      }}
    >
      <img src={src} alt={alt} style={{ display: 'none' }} />
    </motion.div>
  );
};

// Export all components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Actions = CardActions;
Card.Image = CardImage;

export default Card;
