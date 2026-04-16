# Data Fetching Rules

## REGLA CRÍTICA — Solo Server Components

Todo el data fetching en esta aplicación **DEBE** realizarse exclusivamente a través de **Server Components**.

**PROHIBIDO obtener datos mediante:**
- Route handlers (`app/api/*/route.ts`)
- Client Components (`'use client'`)
- Cualquier otro mecanismo (SWR, React Query, fetch desde el cliente, etc.)

**ÚNICO método permitido:** Server Components que llamen a helper functions del directorio `/data`.

---

## Helper Functions en `/data`

Todas las queries a la base de datos **DEBEN** estar encapsuladas en funciones helper dentro del directorio `/data`.

**Reglas obligatorias para los helpers:**
- Usar **Drizzle ORM** para todas las consultas.
- **PROHIBIDO usar raw SQL** (`db.execute`, template literals SQL, etc.).
- Cada helper debe ser una función async que retorne datos tipados con TypeScript.

Ejemplo de estructura:
```
/data
  workouts.ts     → helpers relacionados a workouts
  exercises.ts    → helpers relacionados a exercises
  sets.ts         → helpers relacionados a sets
```

---

## REGLA FUNDAMENTAL — Aislamiento de Datos por Usuario

El usuario autenticado **ÚNICAMENTE puede acceder a sus propios datos**.

**Obligatorio en cada helper function:**
1. Obtener el `userId` del usuario autenticado (vía Clerk: `auth()` desde `@clerk/nextjs/server`).
2. Filtrar **siempre** por `userId` en cada query.
3. **NUNCA** retornar datos de otro usuario, sin importar el contexto.

**Esta regla no tiene excepciones.** Omitir el filtro por `userId` es una vulnerabilidad de seguridad crítica.

Ejemplo correcto:
```ts
// data/workouts.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { workouts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthenticated');

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

Ejemplo incorrecto (PROHIBIDO):
```ts
// ❌ Sin filtro de usuario — expone datos de todos los usuarios
export async function getWorkouts() {
  return db.select().from(workouts);
}

// ❌ Acepta userId externo — permite acceder a datos ajenos
export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```
