import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ConcertList,
  ConcertListProps,
} from '@/presentation/pages/concerts/concertList/ConcertList';
import { ConcertCard } from '@/presentation/pages/concerts/concertCard/ConcertCard';
import { listConcertSummariesResponse } from '@/tests/mocks/data-providers/concert-summary.data-provider';

jest.mock('../concertCard/ConcertCard', () => ({
  ConcertCard: jest.fn(() => <div />),
}));

const makeSut = ({ concerts }: ConcertListProps) => {
  return render(<ConcertList concerts={concerts} />);
};

describe('ConcertList', () => {
  beforeEach(() => {
    (ConcertCard as jest.Mock).mockClear?.();
  });

  it('should render list of concerts when there are concerts', () => {
    const concerts = listConcertSummariesResponse();
    makeSut({ concerts });

    const firstCall = (ConcertCard as jest.Mock).mock.calls[0][0];
    expect(firstCall.artist).toBe(concerts[0].artist);
    expect(ConcertCard).toHaveBeenCalledTimes(concerts.length);
  });

  it('should not render any ConcertCard when there are no concerts', () => {
    const concerts = [] as ConcertListProps['concerts'];
    makeSut({ concerts });

    expect(ConcertCard).not.toHaveBeenCalled();
  });
});
