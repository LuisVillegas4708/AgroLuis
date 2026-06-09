/**
 * M2 — Mini-mapa para fijar la ubicación de la parcela con un pin.
 * Click en el mapa = mover el pin. Devuelve lat/lng al formulario.
 * Usa Leaflet (mapa libre, sin costo).
 */
import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Arreglo del ícono por defecto de Leaflet (problema conocido con bundlers)
const iconoPin = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

// Villa de Álvarez, Colima — centro por defecto
const CENTRO_DEFAULT = [19.2742, -103.7234]

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

export default function MapaPin({ lat, lng, onPick }) {
  const tieneePin = lat != null && lng != null && lat !== '' && lng !== ''
  const centro = useMemo(
    () => (tieneePin ? [Number(lat), Number(lng)] : CENTRO_DEFAULT),
    [tieneePin, lat, lng]
  )

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 220 }}>
      <MapContainer
        center={centro}
        zoom={tieneePin ? 15 : 12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onPick} />
        {tieneePin && <Marker position={[Number(lat), Number(lng)]} icon={iconoPin} />}
      </MapContainer>
    </div>
  )
}
