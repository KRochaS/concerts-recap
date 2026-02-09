import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Hero } from './Hero';

const nextLinkMock = jest.fn();

jest.mock('next/link', () => {
  const NextLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    nextLinkMock(href);
    return <a href={href}>{children}</a>;
  };
  NextLink.displayName = 'NextLink';
  return NextLink;
});

const makeSut = () => {
  return render(<Hero />);
};

describe('Hero', () => {
  it('renders the main heading', () => {
    makeSut();

    expect(screen.getByText(/your concert recap,/i)).toBeInTheDocument();
  });

  it('renders the description text', () => {
    makeSut();

    expect(
      screen.getByText(
        /fill out your concert memories page with the best moments/i
      )
    ).toBeInTheDocument();
  });

  it('renders the register concerts button with correct link', () => {
    makeSut();

    const link = screen.getByRole('link', {
      name: /register concerts/i,
    });

    expect(link).toHaveAttribute('href', '/new-concert');
  });

  it('renders all cards descriptions', () => {
    makeSut();

    expect(
      screen.getByText(/recap your concerts moments/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/see how many people have checked out/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/record the distance you traveled/i)
    ).toBeInTheDocument();
  });

  describe('New Concert', () => {
    it('should navigate to new concert page', async () => {
      nextLinkMock.mockClear();

      makeSut();

      expect(nextLinkMock).toHaveBeenCalledWith('/new-concert');
    });
  });
});
