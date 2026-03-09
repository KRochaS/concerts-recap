import {
  CreateConcertDTO,
  createConcertSchema,
} from '@/core/application/concerts/create-concert.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';

export const INITIAL_MEMORY_DEFAULT_VALUES: Partial<CreateConcertDTO> = {
  artist: '',
  venue: '',
  city: '',
  description: '',
};

export function useInitialMemoryForm(): Pick<
  UseFormReturn<CreateConcertDTO>,
  'control' | 'register' | 'formState' | 'setValue' | 'handleSubmit'
> {
  const form = useForm<CreateConcertDTO>({
    resolver: zodResolver(createConcertSchema),
    defaultValues: INITIAL_MEMORY_DEFAULT_VALUES,
  });

  return {
    control: form.control,
    register: form.register,
    formState: form.formState,
    setValue: form.setValue,
    handleSubmit: form.handleSubmit,
  };
}
