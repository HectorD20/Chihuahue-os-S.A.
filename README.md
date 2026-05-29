# Chihuahueños S.A. de C.V.

Sistema de compra de boletos de autobús interestatales con reserva concurrente de asientos y verificación de identidad.

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | NestJS + TypeORM + PostgreSQL |
| Frontend | Next.js (App Router) + React + HeroUI |
| Almacenamiento | MinIO (identificaciones) |
| Orquestación | Docker Compose |

## Requisitos

- Docker y Docker Compose
- PowerShell (para el script de seed en Windows)

## Inicio rápido

1. Copia las variables de entorno:

```powershell
Copy-Item .env.example .env
```

2. Levanta todos los servicios:

```powershell
docker compose up --build
```

3. En otra terminal, carga los datos iniciales (4 rutas obligatorias + viajes + usuarios):

```powershell
.\scripts\seed-prueba.ps1
```

4. Abre la aplicación:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000/api |
| MinIO Console | http://localhost:9001 |

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Pasajero | `prueba@chihuahuenos.mx` | `prueba123` |
| Admin | `admin@chihuahuenos.mx` | `admin123` |

> También puedes crear una cuenta nueva en http://localhost:3001/registro. El pasajero puede reservar asientos y confirmar compras. Las operaciones de carga de rutas y viajes se realizan vía API con el header `x-api-key`.

## Rutas iniciales

El seed crea automáticamente:

- Oaxaca → Puebla
- Chihuahua → Nuevo León
- Baja California Norte → Baja California Sur
- Chihuahua → CDMX

## Flujo de compra

1. Consultar la cartelera en `/dashboard`
2. Seleccionar un viaje y elegir asiento
3. Confirmar la reserva (bloqueo de 10 minutos con `SELECT ... FOR UPDATE`)
4. Subir identificación (PDF, PNG o JPG) para confirmar la compra

## API de administración

Crear rutas y viajes adicionales con el header `x-api-key` (valor en `.env`):

```powershell
# Nueva ruta
Invoke-RestMethod -Uri "http://localhost:3000/api/rutas" `
  -Method Post `
  -Headers @{ "x-api-key" = "chihuahuenos_secreto_123"; "Content-Type" = "application/json" } `
  -Body '{"origen":"Guadalajara","destino":"Monterrey"}'

# Nuevo viaje (genera 40 boletos automáticamente)
Invoke-RestMethod -Uri "http://localhost:3000/api/viajes" `
  -Method Post `
  -Headers @{ "x-api-key" = "chihuahuenos_secreto_123"; "Content-Type" = "application/json" } `
  -Body '{"ruta_id":1,"fecha_hora_inicio":"2026-06-01T08:00:00.000Z","duracion":480,"precio_boleto":750,"capacidad":40}'
```

## Estructura del proyecto

```
backend/     API NestJS (auth, rutas, viajes, boletos, storage)
frontend/    App Next.js (cartelera, mapa de asientos, login)
scripts/     Seed de datos iniciales
docker-compose.yml
```
