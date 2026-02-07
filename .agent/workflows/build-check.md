---
description: Verifica que el proyecto esté libre de errores y compile correctamente
---

Este workflow realiza una auditoría rápida de la salud del código.

1. Limpiar caché de compilación (opcional)
// turbo
2. Ejecutar el build de Next.js
npx next build

3. Verificar si hay errores críticos en el código
// turbo
4. Listar el resultado final
ls -l .next

Si el build falla, revisaré los logs para sugerir correcciones inmediatas.
