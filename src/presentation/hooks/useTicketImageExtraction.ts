import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CreateConcertDTO } from '@/core/application/concerts/create-concert.dto';
import { ExtractedConcertData } from '@/core/domain/ai';
import { uploadFile } from '@/presentation/shared/lib/firebase';
import { extractConcertDataAction } from '@/app/actions/concert.actions';

interface UseTicketImageExtractionReturn {
  isExtracting: boolean;
  isAutoFilled: boolean;
  isFieldsDisabled: boolean;
  handleImageChange: (file: File | null) => Promise<void>;
}

export function useTicketImageExtraction(
  setValue: UseFormSetValue<CreateConcertDTO>
): UseTicketImageExtractionReturn {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const fillFormFromExtractedData = (data: ExtractedConcertData) => {
    const fieldsToSet: Partial<Record<keyof CreateConcertDTO, string | Date>> =
      {
        artist: data.artist,
        venue: data.venue,
        city: data.city,
        date: data.date,
      };

    Object.entries(fieldsToSet).forEach(([field, value]) => {
      setValue(field as keyof CreateConcertDTO, value);
    });
  };

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setIsExtracting(false);
      setIsAutoFilled(false);
      return;
    }

    setIsExtracting(true);

    try {
      const url = await uploadFile('concerts/ticket', file);
      const result = await extractConcertDataAction(url);

      if (!result.success) {
        setIsAutoFilled(false);
        toast.error(result.message || 'Failed to analyze ticket image');
        return;
      }

      if (!result.data) {
        setIsAutoFilled(false);
        toast.error('Failed to analyze ticket image');
        return;
      }

      fillFormFromExtractedData(result.data);
      setIsAutoFilled(true);

      toast.success('Ticket analyzed successfully!');
    } catch {
      setIsAutoFilled(false);
      toast.error('Failed to upload ticket image. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  return {
    isExtracting,
    isAutoFilled,
    isFieldsDisabled: isExtracting || isAutoFilled,
    handleImageChange,
  };
}
