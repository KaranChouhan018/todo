import { pool } from './config/db.js';

const fixSchema = async () => {
    try {
        console.log('Adding description column if missing...');
        await pool.query(`
      ALTER TABLE todos 
      ADD COLUMN IF NOT EXISTS description TEXT;
    `);
        console.log('✅ Schema updated: description column ensured.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Schema update failed:', error);
        process.exit(1);
    }
};

fixSchema();
