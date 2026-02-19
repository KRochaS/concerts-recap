import { render, screen } from '@testing-library/react';

import { InitialMemory } from '@/presentation/pages/newConcert/steps/initialMemory/InitialMemory';
import userEvent from '@testing-library/user-event';

const makeSut = (onContinue = jest.fn()) => {
  return render(<InitialMemory onContinue={onContinue} />);
};

describe('InitialMemory', () => {
  it('renders the main textarea label', () => {
    makeSut();

    expect(
      screen.getByText(/tell us how the night felt\./i)
    ).toBeInTheDocument();
  });

  it('should call onContinue when click next', async () => {
    const onContinueMock = jest.fn();

    makeSut(onContinueMock);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    expect(onContinueMock).toHaveBeenCalled();
  });
});
