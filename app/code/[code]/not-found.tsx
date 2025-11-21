import Link from 'next/link';

export default function LinkNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Link Statistics Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          This link doesn't exist or has been deleted.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
