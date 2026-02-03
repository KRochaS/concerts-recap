import { Radio } from '../inputRadio/InputRadio';

export function RadioScale() {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Label */}
      <label className="text-sm tracking-wide text-gray-200">
        ENTRANCE SCALE
      </label>

      {/* Radio input */}
      <div
        className="
    w-full h-[49.6px]
    mt-px
    grid grid-cols-4
    place-items-center
    rounded-xl
    bg-background-secondary
    border border-border-secondary
    overflow-hidden
  "
      >
        <Radio name="scale" value="1" />
        <Radio name="scale" value="2" />
        <Radio name="scale" value="3" />
        <Radio name="scale" value="4" />
      </div>

      {/* Extremes */}
      <div className="flex justify-between px-1">
        <span className="text-[10px] text-content-placeholder tracking-widest">
          SMOOTH
        </span>
        <span className="text-[10px] text-content-placeholder tracking-widest">
          HELL
        </span>
      </div>
    </div>
  );
}
