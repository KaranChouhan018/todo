// This file is no longer used as we are connecting to the Express backend
// Keeping it empty to avoid module resolution errors until fully refactored if imported elsewhere
export const sql = {};

// Initialize database tables
export async function initDB() {
  console.log("DB initialization now handled by backend.");
}
