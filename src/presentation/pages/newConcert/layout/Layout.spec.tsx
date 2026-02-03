import { render, screen } from '@testing-library/react';

import { Layout } from './Layout';
import { NewConcertStepEnum } from '@/presentation/ui-model/newConcert/newConcertFlow';

describe('Layout', () => {
  it('renders title and children', () => {
    render(
      <Layout step={NewConcertStepEnum.INITIAL}>
        <div>Child content</div>
      </Layout>
    );

    expect(
      screen.getByRole('heading', { name: /log a new concert memory/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
