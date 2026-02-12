import { prisma } from '@/lib/prisma';
import { ConcertCardContent } from '@/presentation/pages/concerts/concertCardContent/ConcertCardContent';
import { PrismaConcertRepository } from '@/infra/repository/prisma-concert.repository';
import { SearchConcertSummaryUseCase } from '@/core/application/concerts/search-concert-summary.usecase';

export default async function ConcertsPage() {
  const repository = new PrismaConcertRepository(prisma);
  const useCase = new SearchConcertSummaryUseCase(repository);
  const summaries = await useCase.execute();

  return <ConcertCardContent concerts={summaries} />;
}
