'use client';

import { useState } from 'react';
import { Link } from '../_lib/types';
import { formatDate, truncateUrl, getBaseUrl } from '../_lib/utils';
import CopyButton from './CopyButton';

interface LinksTableProps {
  links: Link[];
  onDelete: (code: string) => void;
}

export default function LinksTable({ links, onDelete }: LinksTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    setDeleting(code);
    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete link');
      }

      onDelete(code);
    } catch (error) {
      alert('Failed to delete link. Please try again.');
      console.error(error);
    } finally {
      setDeleting(null);
    }
  };

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No links created yet. Create your first short link above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Clicked
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {links.map((link) => (
              <tr key={link.code} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`/code/${link.code}`}
                      className="text-primary-600 hover:text-primary-800 font-mono font-medium"
                    >
                      {link.code}
                    </a>
                    <CopyButton text={`${getBaseUrl()}/${link.code}`} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={link.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-primary-600"
                    title={link.target_url}
                  >
                    {truncateUrl(link.target_url, 50)}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {link.total_clicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">
                  {formatDate(link.last_clicked_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(link.code)}
                    disabled={deleting === link.code}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  >
                    {deleting === link.code ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
