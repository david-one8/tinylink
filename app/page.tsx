'use client';

import { useEffect, useState } from 'react';
import { Link } from './_lib/types';
import LinkForm from './_components/LinkForm';
import LinksTable from './_components/LinksTable';
import SearchFilter from './_components/SearchFilter';

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<Link[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch links');
      }

      setLinks(data.data);
      setFilteredLinks(data.data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLinks(links);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = links.filter(
      (link) =>
        link.code.toLowerCase().includes(query) ||
        link.target_url.toLowerCase().includes(query)
    );
    setFilteredLinks(filtered);
  }, [searchQuery, links]);

  const handleDelete = (code: string) => {
    setLinks((prev) => prev.filter((link) => link.code !== code));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Create and manage your short links. Track clicks and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <LinkForm onSuccess={fetchLinks} />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Links</p>
                <p className="text-3xl font-bold text-primary-600">{links.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
                <p className="text-3xl font-bold text-green-600">
                  {links.reduce((sum, link) => sum + link.total_clicks, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Links</h2>
          <div className="w-full max-w-md">
            <SearchFilter value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading links...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <LinksTable links={filteredLinks} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
