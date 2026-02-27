import {
  CreateConcertDTO,
  createConcertSchema,
} from '@/core/application/concerts/create-concert.dto';
import { Button } from '@/presentation/shared/components/button/Button';
import { DatePicker } from '@/presentation/shared/components/datepicker/Datepicker';
import { Input } from '@/presentation/shared/components/input/Input';
import { Textarea } from '@/presentation/shared/components/textarea/Textarea';
import { FieldError } from '@/presentation/shared/components/fieldError/FieldError';
import { NewConcertStepProps } from '@/presentation/ui-model/newConcert/newConcertFlow';
import { ArrowRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import TicketUpload from '@/presentation/shared/components/ticketUpload/TicketUpload';
import { createConcertAction } from '@/app/actions/concert.actions';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { uploadFile } from '@/presentation/shared/lib/firebase';

export const InitialMemory = ({ onContinue }: NewConcertStepProps) => {
  const [_urlFile, setUrlFile] = useState<string | null>(null);
  const {
    register,
    control,
    formState: { errors },
  } = useForm<CreateConcertDTO>({
    resolver: zodResolver(createConcertSchema),
    defaultValues: {
      artist: '',
      venue: '',
      city: '',
      description: '',
    },
  });

  const submitData = async (data: CreateConcertDTO) => {
    const result = await createConcertAction(data);

    if (!result?.success) {
      toast.error(result?.message);
      return;
    }

    toast.success('Concert created successfully.');
    onContinue?.();
  };

  const handleImageChange = async (file: File | null) => {
    if (!file) return;

    try {
      const url = await uploadFile('concerts/ticket', file);
      setUrlFile(url);
    } catch {
      toast.error('Failed to upload ticket image. Please try again.');
    }
  };

  return (
    <form
      onSubmit={control.handleSubmit(submitData)}
      className="flex-1 flex flex-col items-center justify-start max-w-4xl mx-auto w-full mb-44"
    >
      <div className="mb-8 h-full w-full">
        <TicketUpload
          onChange={(event) => {
            handleImageChange(event.target.files?.[0] ?? null);
          }}
        />
      </div>
      <div className="w-full">
        <Textarea
          data-testid="description-input"
          label="Tell us how the night felt."
          placeholder="Describe your first impressions, emotions, and standout moments from the concert..."
          rows={6}
          {...register('description')}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 w-full">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker
                    dataTestId="date-input"
                    label="DATE"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError message={errors.date?.message} />
                </>
              )}
            />
          </div>
          <div className="flex flex-col">
            <Input
              data-testid="artist-input"
              label="ARTIST"
              placeholder="e.g., Monsters Tour"
              {...register('artist')}
            />
            <FieldError message={errors.artist?.message} />
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col">
            <Input
              data-testid="venue-input"
              label="VENUE"
              placeholder="e.g., The O2"
              {...register('venue')}
            />
            <FieldError message={errors.venue?.message} />
          </div>
          <div className="flex flex-col">
            <Input
              data-testid="city-input"
              label="CITY"
              placeholder="Nashville"
              {...register('city')}
            />
            <FieldError message={errors.city?.message} />
          </div>
        </div>
      </div>

      <div className="mt-16 flex gap-4">
        <Button
          type="submit"
          name="next-button"
          aria-label="next-button"
          className="text-md"
        >
          {' '}
          NEXT <ArrowRight />
        </Button>
      </div>
    </form>
  );
};
