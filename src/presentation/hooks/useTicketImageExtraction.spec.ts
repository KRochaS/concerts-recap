import { act, renderHook, waitFor } from '@testing-library/react';
import { extractConcertDataAction } from '@/app/actions/concert.actions';
import { uploadFile } from '@/presentation/shared/lib/firebase';
import { useTicketImageExtraction } from '@/presentation/hooks/useTicketImageExtraction';

jest.mock('@/app/actions/concert.actions', () => ({
  extractConcertDataAction: jest.fn(),
}));

jest.mock('@/presentation/shared/lib/firebase', () => ({
  uploadFile: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedExtractConcertDataAction =
  extractConcertDataAction as jest.MockedFunction<
    typeof extractConcertDataAction
  >;
const mockedUploadFile = uploadFile as jest.MockedFunction<typeof uploadFile>;

describe('useTicketImageExtraction', () => {
  beforeEach(() => {
    mockedExtractConcertDataAction.mockReset();
    mockedUploadFile.mockReset();
  });

  it('should preserve the extracted UTC calendar date in the local form', async () => {
    const setValue = jest.fn();
    mockedUploadFile.mockResolvedValueOnce('https://example.com/ticket.jpg');
    mockedExtractConcertDataAction.mockResolvedValueOnce({
      success: true,
      data: {
        date: new Date('2027-07-27T00:00:00Z'),
        artist: 'Esteban',
        venue: 'Bar Opinião',
        city: 'Porto Alegre',
      },
    });
    const { result } = renderHook(() => useTicketImageExtraction(setValue));

    await act(async () => {
      await result.current.handleImageChange(
        new File(['ticket'], 'ticket.jpg')
      );
    });

    await waitFor(() => {
      expect(setValue).toHaveBeenCalledWith('date', new Date(2027, 6, 27));
    });
  });
});
