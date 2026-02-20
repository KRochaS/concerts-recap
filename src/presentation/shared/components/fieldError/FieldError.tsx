import { cn } from '@/presentation/shared/lib/utils';
import { FieldErrorProps } from '@/presentation/shared/ui-model/shared.model';

export const FieldError = ({ message, className }: FieldErrorProps) => {
  if (!message) return null;

  return (
    <p role="alert" className={cn('mt-1 text-xs text-red-400', className)}>
      {message}
    </p>
  );
};
