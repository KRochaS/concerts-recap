import { render, screen } from '@testing-library/react';

import { OrganizeMemory } from './OrganizeMemory';

describe('OrganizeMemory', () => {
  it('renders experience tags section', () => {
    render(<OrganizeMemory onBack={jest.fn()} />);

    expect(screen.getByText(/experience tags/i)).toBeInTheDocument();
  });
});
