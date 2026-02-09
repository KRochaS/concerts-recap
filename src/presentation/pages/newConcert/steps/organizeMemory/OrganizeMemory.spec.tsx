import { render, screen } from '@testing-library/react';

import { OrganizeMemory } from './OrganizeMemory';
import userEvent from '@testing-library/user-event';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const makeSut = () => {
  return render(<OrganizeMemory onBack={jest.fn()} />);
};

describe('OrganizeMemory', () => {
  it('renders experience tags section', () => {
    makeSut();

    expect(screen.getByText(/experience tags/i)).toBeInTheDocument();
  });

  describe('Save Button', () => {
    it('should navigate to concerts page after successful save', async () => {
      makeSut();

      const saveButton = screen.getByRole('button', { name: /save/i });

      await userEvent.click(saveButton);

      expect(pushMock).toHaveBeenCalledWith('/concerts');
    });
  });
});
