import { OverallRatingProps } from '@/presentation/shared/ui-model/shared.model';

export function OverallRating({ id, label, labelProps }: OverallRatingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {label && (
        <label
          htmlFor={id}
          {...labelProps}
          className="max-w-[140px] text-center uppercase text-[10px] tracking-[0.15em]"
        >
          {label}
        </label>
      )}

      <div className="rounded-full w-20 h-20 sm:w-24 sm:h-24 bg-background-tertiary flex items-center justify-center">
        <span className="text-white text-2xl sm:text-3xl">7</span>
      </div>
    </div>
  );
}
