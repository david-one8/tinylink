import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function initDatabase() {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    console.log('Creating links table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS links (
        code VARCHAR(8) PRIMARY KEY,
        target_url TEXT NOT NULL,
        total_clicks INTEGER DEFAULT 0,
        last_clicked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_created_at ON links(created_at DESC)
    `;

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
