import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ConcertCardContent,
  ConcertCardContentProps,
} from './ConcertCardContent';
import { ConcertCard } from '../concertCard/ConcertCard';
import userEvent from '@testing-library/user-event';

jest.mock('../concertCard/ConcertCard', () => ({
  ConcertCard: jest.fn(() => <div />),
}));

const pushMock = jest.fn();

let mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => mockSearchParams,
}));

const initialConcerts = [
  {
    id: '1',
    artist: 'Arctic Monkeys',
    location: 'Manchester, O2 Apollo',
    date: 'March 16, 2025',
    kmTraveled: 288,
  },
];

const makeSut = (
  {
    concerts = initialConcerts,
  }: ConcertCardContentProps = {} as ConcertCardContentProps
) => {
  return render(<ConcertCardContent concerts={concerts} />);
};

const user = userEvent.setup();

describe('ConcertCardContent', () => {
  it('should render list of concerts when there are concerts', () => {
    makeSut();

    expect(screen.getByText(initialConcerts[0].artist)).toBeInTheDocument();
    expect(ConcertCard).toHaveBeenCalledTimes(1);
  });

  it('should updated input value when user types', async () => {
    makeSut();
    const text = 'Arctic';
    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;

    await user.type(searchInput, text);

    expect(searchInput.value).toBe(text);
  });

  describe('Search', () => {
    it('should add search term to URL query params', async () => {
      const text = 'Dashboard Confessional';
      makeSut();

      const searchInput = screen.getByTestId(
        'search-input'
      ) as HTMLInputElement;

      await user.type(searchInput, text);

      expect(pushMock).toHaveBeenCalled();
      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe('/concerts?q=Dashboard%20Confessional');

      await user.clear(searchInput);
      const lastClearCall = pushMock.mock.calls.at(-1);
      expect(lastClearCall?.[0]).toBe('/concerts');
    });

    it('should initialize search input with query param value if present', () => {
      const text = 'q=Arctic';
      const searchParam = new URLSearchParams(`q=${text}`);
      mockSearchParams = searchParam;
      makeSut();

      const searchInput = screen.getByTestId(
        'search-input'
      ) as HTMLInputElement;
      expect(searchInput.value).toBe(text);
    });
  });
});
