import { pool } from './config/db.js';

const addUpdatedAtColumn = async () => {
    try {
        console.log('Adding updated_at column to todos table...');
        await pool.query(`
      ALTER TABLE todos 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    `);
        console.log('✅ Schema updated: updated_at column added successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Schema update failed:', error);
        process.exit(1);
    }
};

addUpdatedAtColumn();
