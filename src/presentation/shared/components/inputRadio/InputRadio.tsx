import { cn } from "@/lib/utils";
import { InputProps } from "../../ui-model/shared.model";


export function Radio({ id, label, labelProps, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center">
        <input
          type="radio"
          id={id}
          name="entrance-scale"
          {...props}
          className="appearance-none cursor-pointer border-2  border-border-secondary checked:border-gray-50 p-1.5 rounded-full bg-background-primary checked:bg-[radial-gradient(ellipse_at_center,_white_50%,_#0F0F10_60%)]"
        />
        <label
          htmlFor={id}
          className={cn("text-right", label && "pl-2")}
          {...labelProps}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
