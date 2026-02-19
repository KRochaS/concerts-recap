import {
  CreateConcertDTO,
  createConcertSchema,
} from '@/core/application/concerts/create-concert.dto';
import { Button } from '@/presentation/shared/components/button/Button';
import { DatePicker } from '@/presentation/shared/components/datepicker/Datepicker';
import { Input } from '@/presentation/shared/components/input/Input';
import { Textarea } from '@/presentation/shared/components/textarea/Textarea';
import { NewConcertStepProps } from '@/presentation/ui-model/newConcert/newConcertFlow';
import { ArrowRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

export const InitialMemory = ({ onContinue }: NewConcertStepProps) => {
  const { register, control } = useForm<CreateConcertDTO>({
    resolver: zodResolver(createConcertSchema),
    defaultValues: {
      artist: '',
      venue: '',
      city: '',
      description: '',
    },
  });
  return (
    <form className="flex-1 flex flex-col items-center justify-start max-w-4xl mx-auto w-full mb-44">
      <Textarea
        label="Tell us how the night felt."
        placeholder="Describe your first impressions, emotions, and standout moments from the concert..."
        rows={6}
        {...register('description')}
      />

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 w-full">
        <div className="flex flex-col gap-4 flex-1">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="DATE"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Input
            label="ARTIST"
            placeholder="e.g., Monsters Tour"
            {...register('artist')}
          />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <Input
            label="VENUE"
            placeholder="e.g., The O2"
            {...register('venue')}
          />
          <Input label="CITY" placeholder="Nashville" {...register('city')} />
        </div>
      </div>

      <div className="mt-16 flex gap-4">
        <Button type="button" className="text-md" onClick={onContinue}>
          {' '}
          NEXT <ArrowRight />
        </Button>
      </div>
    </form>
  );
};
