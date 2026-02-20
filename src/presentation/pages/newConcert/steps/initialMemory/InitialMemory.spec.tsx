import { render, screen, waitFor } from '@testing-library/react';

import { InitialMemory } from '@/presentation/pages/newConcert/steps/initialMemory/InitialMemory';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';

const makeSut = (onContinue = jest.fn()) => {
  return { onContinue, ...render(<InitialMemory onContinue={onContinue} />) };
};

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(
    screen.getByTestId('description-input'),
    'It was an amazing night! The energy was incredible.'
  );
  await user.click(screen.getByTestId('date-input'));
  await user.type(screen.getByTestId('artist-input'), 'Radiohead');
  await user.type(screen.getByTestId('venue-input'), 'Madison Square Garden');
  await user.type(screen.getByTestId('city-input'), 'New York');
};

const createActionMock = jest.fn();
jest.mock('@/app/actions/concert.actions', () => ({
  createConcertAction: (...args: unknown[]) => createActionMock(...args),
}));

jest.mock('@/presentation/shared/components/datepicker/Datepicker', () => ({
  DatePicker: ({
    onChange,
    dataTestId,
  }: {
    onChange?: (date?: Date) => void;
    dataTestId?: string;
  }) => (
    <button
      type="button"
      data-testid={dataTestId}
      onClick={() => onChange?.(new Date('2026-03-15'))}
    >
      Pick date
    </button>
  ),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('InitialMemory', () => {
  const user = userEvent.setup();
  beforeEach(() => {
    createActionMock.mockReset();
    (toast.success as jest.Mock).mockReset();
    (toast.error as jest.Mock).mockReset();
  });
  it('renders the main textarea label', () => {
    makeSut();

    expect(
      screen.getByText(/tell us how the night felt\./i)
    ).toBeInTheDocument();
  });

  it('should create new concert memory with success', async () => {
    const sucessMessage = 'Concert created successfully.';
    createActionMock.mockResolvedValueOnce({
      success: true,
      message: sucessMessage,
    });

    const { onContinue } = makeSut();

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /next-button/i }));
    await waitFor(() => {
      expect(createActionMock).toHaveBeenCalledWith({
        description: 'It was an amazing night! The energy was incredible.',
        date: new Date('2026-03-15'),
        artist: 'Radiohead',
        venue: 'Madison Square Garden',
        city: 'New York',
      });
      expect(toast.success).toHaveBeenCalledWith(sucessMessage);
      expect(onContinue).toHaveBeenCalled();
    });
  });

  it('should show error toast when creation fails', async () => {
    const errorMessage = 'Failed to create concert. Please try again.';
    createActionMock.mockResolvedValueOnce({
      success: false,
      message: errorMessage,
    });
    const user = userEvent.setup();
    const { onContinue } = makeSut();

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /next-button/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(onContinue).not.toHaveBeenCalled();
    });
  });

  it('should show validation errors when form is submitted with invalid data', async () => {
    const user = userEvent.setup();
    makeSut();
    await user.click(screen.getByRole('button', { name: /next-button/i }));
    const requiredFields = ['description', 'date', 'artist', 'venue', 'city'];
    requiredFields.forEach((field) => {
      expect(
        screen.getByText(
          (content) =>
            content.toLowerCase().includes(field) &&
            content.toLowerCase().includes('required')
        )
      ).toBeInTheDocument();
    });
  });
});
