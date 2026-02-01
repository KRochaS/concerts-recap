import { cn } from "@/presentation/shared/lib/utils";
import { InputProps } from "@/presentation/shared/ui-model/shared.model";

const labelPositionStyles = {
  side: {
    container: "flex-row items-center gap-4",
    labelClass: "text-right min-w-[100px] text-sm lg:text-base",
  },
  top: {
    container: "flex-col items-start gap-1.5",
    labelClass: "text-sm lg:text-base",
  },
};

export function Input({
  id,
  label,
  labelProps,
  labelPosition = "top",
  ...props
}: InputProps) {
  const { container, labelClass } = labelPositionStyles[labelPosition];

  return (
    <div className={cn("w-full flex", container)}>
      {label && (
        <label
          htmlFor={id}
          {...labelProps}
          className={cn(labelClass, labelProps?.className)}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={cn(
          `w-full p-3 bg-background-secondary text-white placeholder:text-content-placeholder rounded-xl
          border border-border-secondary hover:text-content-body active:border-border-tertiary outline-none`,
          props.className
        )}
      />
    </div>
  );
}
