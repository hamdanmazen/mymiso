import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-canvas text-text-primary px-6">
      <div className="text-center max-w-md">
        <p className="text-[72px] font-bold text-mizo-red font-tabular leading-none mb-4">
          404
        </p>
        <h1 className="text-[24px] font-bold mb-2">Page Not Found</h1>
        <p className="text-[14px] text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-semibold text-white bg-mizo-red rounded-comfortable hover:bg-mizo-red-hover transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
