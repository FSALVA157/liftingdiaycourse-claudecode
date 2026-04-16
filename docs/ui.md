# UI Standard — Lifting Diary

## Regla principal

**ESTRICTAMENTE PROHIBIDO** crear o usar componentes UI personalizados (custom components).

Todo elemento visual del proyecto **debe** utilizar componentes de [shadcn/ui](https://ui.shadcn.com/). Sin excepciones.

---

## shadcn/ui

### Configuración del proyecto

- **Estilo:** `base-nova`
- **Color base:** `neutral`
- **Variables CSS:** activadas
- **Iconos:** `lucide-react`
- **Alias de importación:** `@/components/ui`

### Agregar componentes

```bash
npx shadcn@latest add <componente>
```

Los componentes se instalan en `components/ui/`. No modificar los archivos generados salvo ajuste de variantes mediante la API de shadcn (props, `className`).

### Uso

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ejemplo</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Acción</Button>
      </CardContent>
    </Card>
  )
}
```

---

## Formateo de fechas

Toda fecha mostrada al usuario **debe** formatearse con [date-fns](https://date-fns.org/) usando el locale `es` (español).

### Formato requerido

```
[ordinal] [mes abreviado] [año]
```

Ejemplos:

| Fecha             | Resultado esperado |
|-------------------|--------------------|
| 2025-09-01        | 1ro Sep 2025       |
| 2025-08-02        | 2do Agos 2025      |
| 2025-01-03        | 3ro Ene 2025       |

### Sufijos ordinales en español

| Número | Sufijo |
|--------|--------|
| 1      | ro     |
| 2      | do     |
| 3      | ro     |
| 4+     | to     |

### Meses abreviados en español

| Mes        | Abreviación |
|------------|-------------|
| Enero      | Ene         |
| Febrero    | Feb         |
| Marzo      | Mar         |
| Abril      | Abr         |
| Mayo       | May         |
| Junio      | Jun         |
| Julio      | Jul         |
| Agosto     | Agos        |
| Septiembre | Sep         |
| Octubre    | Oct         |
| Noviembre  | Nov         |
| Diciembre  | Dic         |

### Utilidad de formateo

Centralizar el formateo en `lib/format-date.ts`:

```ts
import { format } from "date-fns"

const ORDINAL_SUFFIX: Record<number, string> = {
  1: "ro",
  2: "do",
  3: "ro",
}

const MONTH_ABBR: Record<number, string> = {
  1: "Ene",
  2: "Feb",
  3: "Mar",
  4: "Abr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Agos",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dic",
}

function ordinal(day: number): string {
  const suffix = ORDINAL_SUFFIX[day] ?? "to"
  return `${day}${suffix}`
}

/**
 * Formatea una fecha como "1ro Sep 2025".
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const day = d.getDate()
  const month = MONTH_ABBR[d.getMonth() + 1]
  const year = d.getFullYear()
  return `${ordinal(day)} ${month} ${year}`
}
```

### Uso en componentes

```tsx
import { formatDate } from "@/lib/format-date"

// En un Server Component o Client Component:
<p>{formatDate(workout.createdAt)}</p>
// → "1ro Sep 2025"
```

---

## Checklist de revisión

Antes de hacer commit de cualquier componente UI, verificar:

- [ ] Solo se usan componentes de `@/components/ui` (shadcn/ui)
- [ ] No existe ningún `<div>` o elemento HTML raw que podría reemplazarse con un componente shadcn
- [ ] Las fechas se formatean con `formatDate()` de `@/lib/format-date`
- [ ] No se importa `date-fns` directamente en componentes — siempre a través de la utilidad centralizada
