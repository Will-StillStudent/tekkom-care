import { notifications } from '~/server/database/schema'
import { eq, desc } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) return []

  return await db.select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(10)
})