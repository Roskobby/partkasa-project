import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';

test('skip link exists for accessibility', () => {
  render(
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
  const skipLink = screen.getByText(/Skip to content/i);
  expect(skipLink).toBeInTheDocument();
});

