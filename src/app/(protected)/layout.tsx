import AuthGuard from "@/components/AuthGuard";

/**
 * @fileOverview Protected Mission Layout.
 * Wraps all internal routes with the Identity Guard Protocol.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
