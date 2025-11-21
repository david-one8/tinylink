import { notFound } from 'next/navigation';
import { getLinkByCode } from '@/app/_lib/server/queries';
import { formatDate, getBaseUrl } from '@/app/_lib/utils';
import CopyButton from '@/app/_components/CopyButton';

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export default async function StatsPage({ params }: { params: { code: string } }) {
  const code = params.code?.trim();
  if (!CODE_REGEX.test(code)) notFound();

  const link = await getLinkByCode(code);
  if (!link) notFound();

  const shortUrl = `${getBaseUrl()}/${link.code}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <a href="/" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center">
          ← Back to Dashboard
        </a>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary-600 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Link Statistics</h1>
          <p className="text-primary-100">Detailed analytics for your short link</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Short Code</h3>
              <p className="text-2xl font-mono font-bold text-gray-900">{link.code}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Clicks</h3>
              <p className="text-2xl font-bold text-primary-600">{link.total_clicks}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Short URL</h3>
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-primary-600 hover:text-primary-800 font-medium break-all"
              >
                {shortUrl}
              </a>
              <CopyButton text={shortUrl} />
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Target URL</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <a
                href={link.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary-600 break-all"
              >
                {link.target_url}
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
              <p className="text-gray-900">{formatDate(link.created_at)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Last Clicked</h3>
              <p className="text-gray-900">{formatDate(link.last_clicked_at)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Share your short link with others. Each time someone visits
          it, the click count will automatically increment.
        </p>
      </div>
    </div>
  );
}
