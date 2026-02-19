import { cn } from '@/lib/utils';
import { TextareaProps } from '@/presentation/shared/ui-model/shared.model';

export function Textarea({ id, labelProps, label, ...props }: TextareaProps) {
  return (
    <div className="flex-col  w-full flex gap-4">
      <label htmlFor={id} {...labelProps} className="min-w-45">
        {label}
      </label>
      <textarea
        {...props}
        className={cn(
          `w-full p-3 bg-background-secondary text-white placeholder:text-content-placeholder rounded-xl
    border border-transparent hover:border-border-secondary hover:text-content-body active:border-border-tertiary`,
          props.className
        )}
      />
    </div>
  );
}
