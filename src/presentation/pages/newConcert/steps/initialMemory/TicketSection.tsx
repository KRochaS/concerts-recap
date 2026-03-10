import TicketUpload from '@/presentation/shared/components/ticketUpload/TicketUpload';
import { LoadingOverlay } from '@/presentation/shared/components/loadingOverlay/LoadingOverlay';

export const TICKET_ANALYZING_MESSAGE = 'Analyzing ticket image...';

type TicketSectionProps = {
  isExtracting: boolean;
  onImageChange: (file: File | null) => void;
};

export const TicketSection = ({
  isExtracting,
  onImageChange,
}: TicketSectionProps) => {
  return (
    <>
      {isExtracting && <LoadingOverlay message={TICKET_ANALYZING_MESSAGE} />}

      <div className="mb-8 h-full w-full">
        <TicketUpload
          onChange={(event) => {
            onImageChange(event.target.files?.[0] ?? null);
          }}
        />
      </div>
    </>
  );
};
