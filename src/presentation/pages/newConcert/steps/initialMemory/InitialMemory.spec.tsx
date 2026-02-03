import { render, screen } from '@testing-library/react';

import { InitialMemory } from './InitialMemory';

describe('InitialMemory', () => {
  it('renders the main textarea label', () => {
    render(<InitialMemory onContinue={jest.fn()} />);

    expect(
      screen.getByText(/tell us how the night felt\./i)
    ).toBeInTheDocument();
  });
});
