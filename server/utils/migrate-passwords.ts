/**
 * Migration script to hash existing plaintext passwords
 * 
 * Run this once from the project root to migrate all existing passwords:
 * npx tsx server/utils/migrate-passwords.ts
 */

import { db } from './db'
import { users } from '../database/schema'
import { hashAppPassword } from './password'
import { eq } from 'drizzle-orm'

async function migratePasswords() {
  try {
    console.log('🔄 Starting password migration...')

    // Get all users
    const allUsers = await db.select().from(users)
    console.log(`Found ${allUsers.length} users to process`)

    let migrated = 0
    let skipped = 0

    for (const user of allUsers) {
      // Simple check: if password already starts with $2 (bcrypt hash marker), skip it
      if (user.password.startsWith('$2')) {
        console.log(`✓ User ${user.email} already has hashed password, skipping`)
        skipped++
        continue
      }

      try {
        const hashedPassword = await hashAppPassword(user.password)
        await db.update(users)
          .set({ password: hashedPassword })
          .where(eq(users.id, user.id))

        console.log(`✓ Migrated ${user.email}`)
        migrated++
      } catch (err) {
        console.error(`✗ Failed to migrate ${user.email}:`, err)
      }
    }

    console.log(`\n✅ Migration complete!`)
    console.log(`   - Migrated: ${migrated}`)
    console.log(`   - Skipped (already hashed): ${skipped}`)
    console.log(`   - Total: ${allUsers.length}`)

    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migratePasswords()
