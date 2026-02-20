'use server';

import { cache } from 'react';
import { SearchConcertSummaryUseCase } from '@/core/application/concerts/search-concert-summary.usecase';
import { ConcertSummary } from '@/core/domain/concerts';
import { PrismaConcertRepository } from '@/infra/repository/prisma-concert.repository';
import { prisma } from '@/lib/prisma';
import {
  CreateConcertDTO,
  createConcertSchema,
} from '@/core/application/concerts/create-concert.dto';
import z from 'zod';
import { CreateConcertUseCase } from '@/core/application/concerts/create-concert.usecase';

type SearchFormState = {
  success: boolean;
  concerts?: ConcertSummary[];
  message?: string;
};

const getSearchUseCase = cache(() => {
  const repository = new PrismaConcertRepository(prisma);
  return new SearchConcertSummaryUseCase(repository);
});

export async function createConcertAction(data: CreateConcertDTO) {
  const validated = createConcertSchema.safeParse(data);

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);
    return {
      success: false,
      message: 'Invalid data. Please check the form and try again.',
      errors: fieldErrors,
    };
  }

  try {
    const repository = new PrismaConcertRepository(prisma);
    const useCase = new CreateConcertUseCase(repository);
    await useCase.execute(validated.data);
  } catch (error) {
    const _error = error as Error;
    if (_error.message === 'CONCERT_ALREADY_EXISTS') {
      return {
        success: false,
        message:
          'Concert already exists. Please check the details and try again.',
      };
    }

    return {
      success: false,
      message: 'Failed to create concert. Please try again later.',
    };
  }

  return {
    success: true,
    message: 'Concert created successfully.',
  };
}

export async function searchConcertAction(
  _prev: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  const term = String(formData.get('query') ?? '').trim();

  const useCase = getSearchUseCase();

  try {
    const summaries = await useCase.execute(term);
    return {
      success: true,
      concerts: summaries,
    };
  } catch {
    return {
      success: false,
      message: 'Failed to search concerts. Please try again later.',
    };
  }
}
