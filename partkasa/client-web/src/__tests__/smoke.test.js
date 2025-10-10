import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

test('renders layout and navigation', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // Header text
  expect(await screen.findByRole('banner')).toBeInTheDocument();
});