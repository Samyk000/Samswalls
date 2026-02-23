import { cn } from '@/lib/utils/cn';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'rectangle' | 'circle' | 'text';
  className?: string;
}

export function Skeleton({
  width,
  height,
  variant = 'rectangle',
  className,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-bg-tertiary';

  const variantStyles = {
    rectangle: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  const style: React.CSSProperties = {
    width: width
      ? typeof width === 'number'
        ? `${width}px`
        : width
      : variant === 'text'
      ? '100%'
      : undefined,
    height: height
      ? typeof height === 'number'
        ? `${height}px`
        : height
      : variant === 'circle'
      ? width
        ? typeof width === 'number'
          ? `${width}px`
          : width
        : '40px'
      : variant === 'text'
      ? undefined
      : '100px',
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      aria-hidden="true"
    />
  );
}

// Preset skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-lg p-4 space-y-3">
      <Skeleton height={200} className="w-full" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton variant="circle" width={size} height={size} />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}