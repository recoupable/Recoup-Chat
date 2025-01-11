export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 allow-scroll">{children}</div>;
}
