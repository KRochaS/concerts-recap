import { cn } from '../../lib/utils';
import { ButtonProps } from '../../ui-model/shared.model';

export const Button = ({
  children,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        'w-s cursor-pointer p-3 text-white rounded-xl font-bold whitespace-nowrap hover:opacity-95 disabled:opacity-70 flex gap-4 uppercase',
        variant === 'primary' && 'bg-accent-purple',
        variant === 'secondary' && 'bg-background-tertiary',
        variant === 'outlined' && 'border-border-primary',
        props.className
      )}
    >
      {children}
    </button>
  );
};
