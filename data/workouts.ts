import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { workouts, exercises, users } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export async function getWorkouts() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error('Unauthenticated');

  return db
    .select({
      id: workouts.id,
      name: workouts.name,
      date: workouts.date,
      notes: workouts.notes,
      exerciseCount: count(exercises.id),
    })
    .from(workouts)
    .innerJoin(users, eq(workouts.userId, users.id))
    .leftJoin(exercises, eq(exercises.workoutId, workouts.id))
    .where(eq(users.clerkUserId, clerkUserId))
    .groupBy(workouts.id, workouts.name, workouts.date, workouts.notes);
}

export type Workout = Awaited<ReturnType<typeof getWorkouts>>[number];
