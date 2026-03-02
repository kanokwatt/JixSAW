import "../styles/index.css"; // เรียกใช้ Tailwind ตรงนี้

export const metadata = {
  title: "My Project",
  description: "Created with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}