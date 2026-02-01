
import { cn } from "@/lib/utils";
import { FaAngleDown } from "react-icons/fa6";
import { SelectProps } from "../../ui-model/shared.model";

export function Select({
  id,
  label,
  labelProps,
  options,
  ...props
}: SelectProps) {
  return (
    <div className="w-full flex gap-4 items-center relative">
      {label && (
        <label htmlFor={id} {...labelProps} className="w-[262px] text-right">
          {label}
        </label>
      )}
      <select
        {...props}
        id={id}
        className={cn(
          `w-full p-3 pr-12 bg-background-secondary text-white placeholder:text-content-placeholder rounded-xl
          border border-border-secondary hover:text-content-body active:border-border-tertiary appearance-none`,
          props.className
        )}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FaAngleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
    </div>
  );
}
