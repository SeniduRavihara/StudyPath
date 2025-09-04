import { openDatabaseSync } from "expo-sqlite";

export async function runMigrations() {
  try {
    const expoDb = openDatabaseSync("studypath.db");

    // Check if isImported column exists
    const result = await expoDb.getAllAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='quizzes'
    `);

    if (result.length > 0) {
      // Check if isImported column exists
      const columns = await expoDb.getAllAsync(`
        PRAGMA table_info(quizzes)
      `);

      const hasIsImported = columns.some(
        (col: any) => col.name === "isImported",
      );

      if (!hasIsImported) {
        console.log("🔄 Adding missing columns to quizzes table...");

        // Add isImported column
        await expoDb.execAsync(`
          ALTER TABLE quizzes ADD COLUMN isImported INTEGER DEFAULT 0
        `);

        // Add importedFromPostId column
        await expoDb.execAsync(`
          ALTER TABLE quizzes ADD COLUMN importedFromPostId TEXT
        `);

        console.log("✅ Database migration completed successfully");
      } else {
        console.log("✅ Database schema is up to date");
      }
    }
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  }
}
