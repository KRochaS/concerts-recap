import { render, screen } from '@/lib/test-utils';
import { Layout } from './Layout';
import { NewConcertStepEnum } from '@/presentation/ui-model/newConcert/newConcertFlow';

const makeSut = (step: NewConcertStepEnum = NewConcertStepEnum.INITIAL) => {
  return render(
    <Layout step={step}>
      <div>Child content</div>
    </Layout>
  );
};

describe('Layout', () => {
  it('should render title and children', () => {
    makeSut(NewConcertStepEnum.INITIAL);

    expect(
      screen.getByRole('heading', { name: /log a new concert memory/i })
    ).toBeInTheDocument();
    screen.getByText(
      /Capture the essence of the performance while it's still vivid\./i
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should render correct step description for ORGANIZE step', () => {
    makeSut(NewConcertStepEnum.ORGANIZE);

    expect(
      screen.getByText(/Fill in the details below to save your experience\./i)
    ).toBeInTheDocument();
  });
});
