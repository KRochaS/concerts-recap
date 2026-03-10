import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';

import { CreateConcertDTO } from '@/core/application/concerts/create-concert.dto';
import { DatePicker } from '@/presentation/shared/components/datepicker/Datepicker';
import { Input } from '@/presentation/shared/components/input/Input';
import { InitialMemoryField } from '@/presentation/pages/newConcert/steps/initialMemory/InitialMemoryField';

type ConcertDetailsGridProps = {
  control: Control<CreateConcertDTO>;
  errors: FieldErrors<CreateConcertDTO>;
  register: UseFormRegister<CreateConcertDTO>;
  isFieldsDisabled: boolean;
};

export const ConcertDetailsGrid = ({
  control,
  errors,
  register,
  isFieldsDisabled,
}: ConcertDetailsGridProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 w-full">
      <div className="flex flex-col gap-4 flex-1">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <InitialMemoryField errorMessage={errors.date?.message}>
              <DatePicker
                dataTestId="date-input"
                label="DATE"
                value={field.value}
                onChange={field.onChange}
                disabled={isFieldsDisabled}
              />
            </InitialMemoryField>
          )}
        />
        <InitialMemoryField errorMessage={errors.artist?.message}>
          <Input
            data-testid="artist-input"
            label="ARTIST"
            placeholder="e.g., Monsters Tour"
            disabled={isFieldsDisabled}
            {...register('artist')}
          />
        </InitialMemoryField>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <InitialMemoryField errorMessage={errors.venue?.message}>
          <Input
            data-testid="venue-input"
            label="VENUE"
            placeholder="e.g., The O2"
            disabled={isFieldsDisabled}
            {...register('venue')}
          />
        </InitialMemoryField>
        <InitialMemoryField errorMessage={errors.city?.message}>
          <Input
            data-testid="city-input"
            label="CITY"
            placeholder="Nashville"
            disabled={isFieldsDisabled}
            {...register('city')}
          />
        </InitialMemoryField>
      </div>
    </div>
  );
};
