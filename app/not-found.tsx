import Link from "next/link";
import Container from "@components/ui/Container";

const NotFound = () => {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="select-none text-7xl font-black leading-none tracking-tight text-primary-100 sm:text-9xl">
        404
      </span>

      <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        The page you are looking for doesn&apos;t exist or may have been moved.
        Let&apos;s get you back on track.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
        >
          Back to home
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-primary-600 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20"
        >
          Browse products
        </Link>
      </div>
    </Container>
  );
};

export default NotFound;
