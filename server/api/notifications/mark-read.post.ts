// server/api/notifications/mark-read.post.ts
import { notifications } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  await db.update(notifications)
    .set({ isRead: 1 })
    .where(eq(notifications.id, Number(body.id)))

  return { success: true }
})