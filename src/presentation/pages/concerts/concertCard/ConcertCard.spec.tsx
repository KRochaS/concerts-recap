import { render } from '@testing-library/react';
import { ConcertCard } from '@/presentation/pages/concerts/concertCard/ConcertCard';
import { listConcertSummariesResponse } from '@/tests/mocks/data-providers/concert-summary.data-provider';

describe('ConcertCard', () => {
  it('should render concert details correctly', () => {
    const props = listConcertSummariesResponse()[0];
    const { getByText } = render(<ConcertCard {...props} />);

    expect(getByText(props.artist)).toBeInTheDocument();
    expect(getByText(props.city)).toBeInTheDocument();

    expect(getByText(/feb.*2026/i)).toBeInTheDocument();
    expect(getByText(`${props.kmTraveled} km travelled`)).toBeInTheDocument();
  });
});
