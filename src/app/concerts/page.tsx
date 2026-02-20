import { prisma } from '@/lib/prisma';
import { ConcertCardContent } from '@/presentation/pages/concerts/concertCardContent/ConcertCardContent';
import { PrismaConcertRepository } from '@/infra/repository/prisma-concert.repository';
import { SearchConcertSummaryUseCase } from '@/core/application/concerts/search-concert-summary.usecase';
import { Suspense } from 'react';
import { Loader } from 'lucide-react';
import { ConcertSummary } from '@/core/domain/concerts';

export default async function ConcertsPage() {
  const repository = new PrismaConcertRepository(prisma);
  const useCase = new SearchConcertSummaryUseCase(repository);
  let concerts = [] as ConcertSummary[];
  try {
    concerts = await useCase.execute();
  } catch {
    concerts = [];
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="animate-spin h-8 w-8 text-purple-500 mb-2" />
          <span className="text-white/80">Loading concerts...</span>
        </div>
      }
    >
      <ConcertCardContent concerts={concerts} />
    </Suspense>
  );
}
