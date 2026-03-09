import { CreateConcertDTO } from '@/core/application/concerts/create-concert.dto';
import { createConcertAction } from '@/app/actions/concert.actions';
import { Button } from '@/presentation/shared/components/button/Button';
import { useTicketImageExtraction } from '@/presentation/hooks/useTicketImageExtraction';
import { useInitialMemoryForm } from '@/presentation/pages/newConcert/steps/initialMemory/useInitialMemoryForm';
import { TicketSection } from '@/presentation/pages/newConcert/steps/initialMemory/TicketSection';
import { DescriptionSection } from '@/presentation/pages/newConcert/steps/initialMemory/DescriptionSection';
import { ConcertDetailsGrid } from '@/presentation/pages/newConcert/steps/initialMemory/ConcertDetailsGrid';
import { NewConcertStepProps } from '@/presentation/ui-model/newConcert/newConcertFlow';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export const InitialMemory = ({ onContinue }: NewConcertStepProps) => {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useInitialMemoryForm();

  const { isExtracting, isFieldsDisabled, handleImageChange } =
    useTicketImageExtraction(setValue);

  const submitData = async (data: CreateConcertDTO) => {
    const result = await createConcertAction(data);

    if (!result?.success) {
      toast.error(result?.message);
      return;
    }

    toast.success('Concert created successfully.');
    onContinue?.();
  };

  return (
    <form
      onSubmit={handleSubmit(submitData)}
      className="flex-1 flex flex-col items-center justify-start max-w-4xl mx-auto w-full mb-44"
    >
      <TicketSection
        isExtracting={isExtracting}
        onImageChange={handleImageChange}
      />

      <DescriptionSection
        descriptionField={register('description')}
        errorMessage={errors.description?.message}
      />

      <ConcertDetailsGrid
        control={control}
        errors={errors}
        register={register}
        isFieldsDisabled={isFieldsDisabled}
      />

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
