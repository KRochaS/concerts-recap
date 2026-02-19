import { cn } from '@/lib/utils';
import { InputProps } from '@/presentation/shared/ui-model/shared.model';

export function Checkbox({ id, label, className, ...props }: InputProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className={cn('uppercase text-right', className)}>
        {label}
      </label>
      <div className="relative">
        <input
          className="
            peer relative cursor-pointer appearance-none shrink-0 w-5 h-5 border-2 rounded-sm mt-1 bg-background-secondary
            focus:outline-none focus:ring-offset-0 focus:ring-1 focus:ring-blue-100
            border-border-secondary
            disabled:border-steel-400 disabled:bg-steel-400
          "
          type="checkbox"
          {...props}
        />
        <svg
          className="absolute w-4 h-4 pointer-events-none hidden peer-checked:block stroke-white mt-1.5 ml-0.5 top-0 outline-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    </div>
  );
}
