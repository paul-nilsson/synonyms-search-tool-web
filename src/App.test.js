import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SynonymsSearch', () => {
  render(<App />);
    const linkElement = screen.getByText(/Synonyms Search Tool/i);
  expect(linkElement).toBeInTheDocument();
});
