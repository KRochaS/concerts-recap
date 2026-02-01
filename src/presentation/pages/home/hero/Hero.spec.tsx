import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Hero } from "./Hero";


jest.mock("next/link", () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>;
});

describe("Hero", () => {
  it("renders the main heading", () => {
    render(<Hero />);

    expect(screen.getByText(/your concert recap,/i)).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<Hero />);

    expect(
      screen.getByText(
        /fill out your concert memories page with the best moments/i
      )
    ).toBeInTheDocument();
  });

  it("renders the register concerts button with correct link", () => {
    render(<Hero />);

    const link = screen.getByRole("link", {
      name: /register concerts/i,
    });

    expect(link).toHaveAttribute("href", "/new-concert");
  });

  it("renders all cards descriptions", () => {
    render(<Hero />);

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
});
