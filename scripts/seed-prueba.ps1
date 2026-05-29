# Datos iniciales de Chihuahueños S.A. de C.V.
# Uso: .\scripts\seed-prueba.ps1
#
# Crea las 4 rutas obligatorias del proyecto (si faltan), un viaje por ruta
# y cuentas de prueba con contraseñas hasheadas (bcrypt).

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Get-Content "$root\.env" | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim()
  }
}

$apiKey = $env:API_KEY
if (-not $apiKey) { $apiKey = "chihuahuenos_secreto_123" }

$headers = @{
  "x-api-key"    = $apiKey
  "Content-Type" = "application/json"
}

function Wait-Backend {
  Write-Host "Esperando backend en http://localhost:3000 ..."
  for ($i = 0; $i -lt 60; $i++) {
    try {
      Invoke-RestMethod -Uri "http://localhost:3000/api" -Method Get -TimeoutSec 3 | Out-Null
      return
    } catch {
      Start-Sleep -Seconds 5
    }
  }
  throw "El backend no respondió a tiempo."
}

function Get-BcryptHash([string]$password) {
  $script = "const b=require('bcrypt'); b.hash('$password', 10).then(h=>process.stdout.write(h))"
  $hash = docker exec chihuahuenos-backend node -e $script
  if (-not $hash) { throw "No se pudo generar el hash bcrypt." }
  return $hash.Trim()
}

function New-Ruta([string]$origen, [string]$destino) {
  $body = @{ origen = $origen; destino = $destino } | ConvertTo-Json -Compress
  return Invoke-RestMethod `
    -Uri "http://localhost:3000/api/rutas" `
    -Method Post `
    -Headers $headers `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
    -ContentType "application/json; charset=utf-8"
}

function New-Viaje(
  [int]$rutaId,
  [datetime]$fechaInicio,
  [int]$duracion,
  [double]$precio
) {
  $body = @{
    ruta_id           = $rutaId
    fecha_hora_inicio = $fechaInicio.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.000Z")
    duracion          = $duracion
    precio_boleto     = $precio
    capacidad         = 40
  } | ConvertTo-Json -Compress

  return Invoke-RestMethod `
    -Uri "http://localhost:3000/api/viajes" `
    -Method Post `
    -Headers $headers `
    -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) `
    -ContentType "application/json; charset=utf-8"
}

function Test-RutaProgramada([object[]]$viajes, [string]$origen, [string]$destino) {
  foreach ($viaje in $viajes) {
    if ($viaje.ruta.origen -eq $origen -and $viaje.ruta.destino -eq $destino) {
      return $true
    }
  }
  return $false
}

Wait-Backend

Write-Host "Creando usuarios de prueba..."
$hashPasajero = Get-BcryptHash "prueba123"
$hashAdmin = Get-BcryptHash "admin123"

$usuarioSql = @"
INSERT INTO usuarios (id, nombre, email, password, role)
VALUES
  ('00000000-0000-4000-8000-000000000001', 'Pasajero Prueba', 'prueba@chihuahuenos.mx', '$hashPasajero', 'PASAJERO'),
  ('00000000-0000-4000-8000-000000000002', 'Administrador', 'admin@chihuahuenos.mx', '$hashAdmin', 'ADMIN')
ON CONFLICT (email) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  password = EXCLUDED.password,
  role = EXCLUDED.role;
"@
docker exec -i chihuahuenos-postgres psql -U $env:POSTGRES_USER -d $env:POSTGRES_DB -c $usuarioSql | Out-Null

Write-Host "Verificando rutas obligatorias del documento..."
$viajesActuales = @(Invoke-RestMethod -Uri "http://localhost:3000/api/viajes" -Method Get)

$rutasDef = @(
  @{ Origen = "Oaxaca"; Destino = "Puebla"; Duracion = 480; Precio = 650.00; Dias = 2 },
  @{ Origen = "Chihuahua"; Destino = "Nuevo León"; Duracion = 720; Precio = 950.00; Dias = 3 },
  @{ Origen = "Baja California Norte"; Destino = "Baja California Sur"; Duracion = 600; Precio = 1200.00; Dias = 4 },
  @{ Origen = "Chihuahua"; Destino = "CDMX"; Duracion = 900; Precio = 1100.00; Dias = 5 }
)

$viajesCreados = @()

foreach ($def in $rutasDef) {
  if (Test-RutaProgramada -viajes $viajesActuales -origen $def.Origen -destino $def.Destino) {
    Write-Host "  Ya programada: $($def.Origen) -> $($def.Destino)" -ForegroundColor Yellow
    continue
  }

  $ruta = New-Ruta -origen $def.Origen -destino $def.Destino
  $fecha = (Get-Date).Date.AddDays($def.Dias).AddHours(8)
  $viaje = New-Viaje -rutaId $ruta.id -fechaInicio $fecha -duracion $def.Duracion -precio $def.Precio
  $viajesCreados += [PSCustomObject]@{
    Ruta   = "$($ruta.origen) -> $($ruta.destino)"
    Viaje  = $viaje.id
    Salida = $fecha.ToString("yyyy-MM-dd HH:mm")
    Precio = $def.Precio
  }
  Write-Host "  Creada: $($ruta.origen) -> $($ruta.destino) (viaje #$($viaje.id))" -ForegroundColor Green
}

Write-Host ""
Write-Host "Datos iniciales listos:" -ForegroundColor Green
Write-Host ""
Write-Host "Usuarios de prueba:"
Write-Host "  Pasajero: prueba@chihuahuenos.mx / prueba123"
Write-Host "  Admin:    admin@chihuahuenos.mx / admin123"
Write-Host ""

if ($viajesCreados.Count -gt 0) {
  Write-Host "Viajes nuevos creados:"
  $viajesCreados | Format-Table -AutoSize
} else {
  Write-Host "Las 4 rutas del documento ya estaban programadas."
}

Write-Host ""
Write-Host "Abre en el navegador:" -ForegroundColor Cyan
Write-Host "  Inicio:     http://localhost:3001"
Write-Host "  Cartelera:  http://localhost:3001/dashboard"
