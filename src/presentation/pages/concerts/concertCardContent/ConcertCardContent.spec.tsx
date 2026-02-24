import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ConcertCardContent,
  ConcertCardContentProps,
} from '@/presentation/pages/concerts/concertCardContent/ConcertCardContent';
import userEvent from '@testing-library/user-event';
import { listConcertSummariesResponse } from '@/tests/mocks/data-providers/concert-summary.data-provider';
import { useState } from 'react';

const pushMock = jest.fn();
const setQueryMock = jest.fn();

let mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('nuqs', () => ({
  useQueryState: (key: string) => {
    const [value, setValue] = useState(mockSearchParams.get(key) ?? '');

    const setQuery = (nextValue: string) => {
      setQueryMock(nextValue);
      setValue(nextValue);
    };
    return [value, setQuery] as const;
  },
}));

const makeSut = (
  {
    concerts = listConcertSummariesResponse(),
  }: ConcertCardContentProps = {} as ConcertCardContentProps
) => {
  return render(<ConcertCardContent concerts={concerts} />);
};

const user = userEvent.setup();

describe('ConcertCardContent', () => {
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

      expect(setQueryMock).toHaveBeenCalled();
      const lastCall = setQueryMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe(text);

      await user.clear(searchInput);
      const lastClearCall = setQueryMock.mock.calls.at(-1);
      expect(lastClearCall?.[0]).toBe('');
    });

    it('should submit the form when search term is added', async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, 'requestSubmit')
        .mockImplementation(undefined);
      makeSut();

      const searchInput = screen.getByTestId(
        'search-input'
      ) as HTMLInputElement;

      await user.type(searchInput, 'Arctic Monkeys');

      expect(submitSpy).toHaveBeenCalled();
      submitSpy.mockRestore();
    });

    it('should automatically submit on mount when a query is present', async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, 'requestSubmit')
        .mockImplementation(undefined);
      const text = 'Arctic';
      const searchParam = new URLSearchParams(`q=${text}`);
      mockSearchParams = searchParam;

      makeSut();

      expect(submitSpy).toHaveBeenCalled();
      submitSpy.mockRestore();
    });

    it('should initialize search input with query param value if present', async () => {
      const text = 'q=Arctic';
      const searchParam = new URLSearchParams(`q=${text}`);
      mockSearchParams = searchParam;
      makeSut();

      const searchInput = screen.getByTestId(
        'search-input'
      ) as HTMLInputElement;
      await waitFor(() => expect(searchInput.value).toBe(text));
    });
  });
});
