'use server';

import { SearchConcertSummaryUseCase } from '@/core/application/concerts/search-concert-summary.usecase';
import { ConcertSummary } from '@/core/domain/concerts';
import { PrismaConcertRepository } from '@/infra/repository/prisma-concert.repository';
import { prisma } from '@/lib/prisma';

type SearchFormState = {
  success: boolean;
  concerts?: ConcertSummary[];
  message?: string;
};

export async function searchConcertAction(
  _prev: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  const term = String(formData.get('query') ?? '').trim();

  const repository = new PrismaConcertRepository(prisma);
  const useCase = new SearchConcertSummaryUseCase(repository);

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
