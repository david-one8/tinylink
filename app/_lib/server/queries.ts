'use server';

import { sql } from './db';
import { Link } from '../types';

export async function getAllLinks(): Promise<Link[]> {
  try {
    const result = await sql`
      SELECT code, target_url, total_clicks, last_clicked_at, created_at
      FROM links
      ORDER BY created_at DESC
    `;
    return result as Link[];
  } catch (error) {
    console.error('Error fetching links:', error);
    throw new Error('Failed to fetch links');
  }
}

export async function getLinkByCode(code: string): Promise<Link | null> {
  try {
    const result = await sql`
      SELECT code, target_url, total_clicks, last_clicked_at, created_at
      FROM links
      WHERE code = ${code}
    `;
    return result.length > 0 ? (result[0] as Link) : null;
  } catch (error) {
    console.error('Error fetching link:', error);
    throw new Error('Failed to fetch link');
  }
}

export async function createLink(
  code: string,
  targetUrl: string
): Promise<Link> {
  try {
    const result = await sql`
      INSERT INTO links (code, target_url, total_clicks, created_at)
      VALUES (${code}, ${targetUrl}, 0, NOW())
      RETURNING code, target_url, total_clicks, last_clicked_at, created_at
    `;
    return result[0] as Link;
  } catch (error: any) {
    if (error?.code === '23505') {
      // Unique constraint violation
      throw new Error('Code already exists');
    }
    console.error('Error creating link:', error);
    throw new Error('Failed to create link');
  }
}

export async function incrementClick(code: string): Promise<void> {
  try {
    await sql`
      UPDATE links
      SET total_clicks = total_clicks + 1,
          last_clicked_at = NOW()
      WHERE code = ${code}
    `;
  } catch (error) {
    console.error('Error incrementing click:', error);
    throw new Error('Failed to update click count');
  }
}

export async function deleteLink(code: string): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM links
      WHERE code = ${code}
      RETURNING code
    `;
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting link:', error);
    throw new Error('Failed to delete link');
  }
}

export async function checkCodeExists(code: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 FROM links WHERE code = ${code}
    `;
    return result.length > 0;
  } catch (error) {
    console.error('Error checking code:', error);
    throw new Error('Failed to check code');
  }
}
