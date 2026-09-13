import '../styles.css';
import './order.css';

export const metadata = {
  title: 'Forever Surprise | Send a little magic',
  description: 'Thoughtful flowers, cakes, and gifts delivered in Pokhara.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}