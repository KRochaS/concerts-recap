import { UseFormRegisterReturn } from 'react-hook-form';

import { Textarea } from '@/presentation/shared/components/textarea/Textarea';
import { InitialMemoryField } from '@/presentation/pages/newConcert/steps/initialMemory/InitialMemoryField';

type DescriptionSectionProps = {
  descriptionField: UseFormRegisterReturn;
  errorMessage?: string;
};

export const DescriptionSection = ({
  descriptionField,
  errorMessage,
}: DescriptionSectionProps) => {
  return (
    <InitialMemoryField className="w-full" errorMessage={errorMessage}>
      <Textarea
        data-testid="description-input"
        label="Tell us how the night felt."
        placeholder="Describe your first impressions, emotions, and standout moments from the concert..."
        rows={6}
        {...descriptionField}
      />
    </InitialMemoryField>
  );
};
