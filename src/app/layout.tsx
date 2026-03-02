import "../styles/index.css"; // เรียกใช้ Tailwind ตรงนี้

export const metadata = {
  title: "JIxSAW Health",
  description: "Next.js Application",
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