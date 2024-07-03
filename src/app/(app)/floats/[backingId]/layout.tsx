import UsersWithAccessToBackingProvider from '@/contexts/UsersWithAccessToBacking';

export default function BackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UsersWithAccessToBackingProvider>
      {children}
    </UsersWithAccessToBackingProvider>
  );
}
