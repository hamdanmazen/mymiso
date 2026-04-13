import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12 bg-canvas">
      <Link href="/" className="inline-block mb-8">
        <Image src="/logo.png" alt="Mymiso" width={144} height={144} className="rounded-comfortable" />
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
