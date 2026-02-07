import { Button } from '@/presentation/shared/components/button/Button';
import { DatePicker } from '@/presentation/shared/components/datepicker/Datepicker';
import { Input } from '@/presentation/shared/components/input/Input';
import { Textarea } from '@/presentation/shared/components/textarea/Textarea';
import { NewConcertStepProps } from '@/presentation/ui-model/newConcert/newConcertFlow';
import { ArrowRight } from 'lucide-react';

export function InitialMemory({ onContinue }: NewConcertStepProps) {
  return (
    <form className="flex-1 flex flex-col items-center justify-start max-w-4xl mx-auto w-full mb-44">
      <Textarea
        label="Tell us how the night felt."
        placeholder="Describe your first impressions, emotions, and standout moments from the concert..."
        rows={6}
      />

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-8 w-full">
        <div className="flex flex-col gap-4 flex-1">
          <DatePicker label="DATE" />
          <Input label="ARTIST" placeholder="e.g., Monsters Tour" />
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <Input label="VENUE" placeholder="e.g., The O2" />
          <Input label="CITY" placeholder="Nashville" />
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
}
