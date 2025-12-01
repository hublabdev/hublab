import type { CapsuleDefinition } from './types'

export const MapCapsule: CapsuleDefinition = {
  id: 'map',
  name: 'Map',
  description: 'Interactive map component with markers, regions, and location features',
  category: 'media',
  tags: ['map', 'location', 'geo', 'markers', 'navigation', 'places'],
  version: '1.0.0',
  platforms: {
    web: {
      framework: 'react',
      dependencies: ['react', 'leaflet'],
      files: [
        {
          filename: 'Map.tsx',
          code: `import React, { useEffect, useRef, useState, useCallback } from 'react'

interface Coordinate {
  lat: number
  lng: number
}

interface Marker {
  id: string
  position: Coordinate
  title?: string
  description?: string
  icon?: 'default' | 'pin' | 'dot' | 'custom'
  color?: string
  draggable?: boolean
}

interface MapProps {
  center?: Coordinate
  zoom?: number
  markers?: Marker[]
  onMarkerClick?: (marker: Marker) => void
  onMarkerDragEnd?: (marker: Marker, newPosition: Coordinate) => void
  onMapClick?: (position: Coordinate) => void
  showUserLocation?: boolean
  interactive?: boolean
  height?: number | string
  style?: 'streets' | 'satellite' | 'terrain' | 'dark'
  className?: string
}

// Simple map implementation using OpenStreetMap tiles
export function Map({
  center = { lat: 40.4168, lng: -3.7038 }, // Madrid by default
  zoom = 13,
  markers = [],
  onMarkerClick,
  onMarkerDragEnd,
  onMapClick,
  showUserLocation = false,
  interactive = true,
  height = 400,
  style = 'streets',
  className = ''
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return

      // Load CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.async = true
        script.onload = () => initMap()
        document.body.appendChild(script)
      } else {
        initMap()
      }
    }

    const initMap = () => {
      if (!mapRef.current || !window.L) return

      const L = window.L as any

      // Create map
      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive
      })

      // Add tile layer based on style
      const tileUrls: Record<string, string> = {
        streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      }

      L.tileLayer(tileUrls[style], {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      // Add markers
      markers.forEach(marker => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: \`<div style="
            width: 24px;
            height: 24px;
            background: \${marker.color || '#3b82f6'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>\`,
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        })

        const m = L.marker([marker.position.lat, marker.position.lng], {
          icon,
          draggable: marker.draggable
        }).addTo(map)

        if (marker.title || marker.description) {
          m.bindPopup(\`
            <div style="min-width: 150px;">
              \${marker.title ? \`<strong>\${marker.title}</strong>\` : ''}
              \${marker.description ? \`<p style="margin: 4px 0 0 0;">\${marker.description}</p>\` : ''}
            </div>
          \`)
        }

        m.on('click', () => onMarkerClick?.(marker))

        if (marker.draggable) {
          m.on('dragend', (e: any) => {
            const newPos = e.target.getLatLng()
            onMarkerDragEnd?.(marker, { lat: newPos.lat, lng: newPos.lng })
          })
        }
      })

      // Map click handler
      map.on('click', (e: any) => {
        onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng })
      })

      setMapInstance(map)
      setIsLoading(false)
    }

    loadLeaflet()

    return () => {
      if (mapInstance) {
        mapInstance.remove()
      }
    }
  }, [])

  // Get user location
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          })
        },
        (err) => console.warn('Geolocation error:', err)
      )
    }
  }, [showUserLocation])

  // Add user location marker
  useEffect(() => {
    if (mapInstance && userLocation && window.L) {
      const L = window.L as any
      const userIcon = L.divIcon({
        className: 'user-location',
        html: \`<div style="
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        "></div>\`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstance)
        .bindPopup('Your location')
    }
  }, [mapInstance, userLocation])

  return (
    <div className={\`relative \${className}\`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ height }}
      />
    </div>
  )
}

// Static map image (no JS required)
interface StaticMapProps {
  center: Coordinate
  zoom?: number
  markers?: Array<{ lat: number; lng: number; color?: string }>
  width?: number
  height?: number
  style?: 'streets' | 'satellite'
  className?: string
}

export function StaticMap({
  center,
  zoom = 14,
  markers = [],
  width = 600,
  height = 400,
  style = 'streets',
  className = ''
}: StaticMapProps) {
  // Using OpenStreetMap static tiles
  const markerParams = markers
    .map(m => \`pin-s+\${(m.color || '3b82f6').replace('#', '')}(\${m.lng},\${m.lat})\`)
    .join(',')

  // Note: In production, use a proper static map API
  const mapUrl = \`https://staticmap.openstreetmap.de/staticmap.php?center=\${center.lat},\${center.lng}&zoom=\${zoom}&size=\${width}x\${height}\`

  return (
    <img
      src={mapUrl}
      alt="Map"
      width={width}
      height={height}
      className={\`rounded-lg \${className}\`}
      loading="lazy"
    />
  )
}

// Location picker
interface LocationPickerProps {
  value?: Coordinate
  onChange?: (location: Coordinate) => void
  placeholder?: string
  className?: string
}

export function LocationPicker({
  value,
  onChange,
  placeholder = 'Select a location on the map',
  className = ''
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempLocation, setTempLocation] = useState<Coordinate | null>(value || null)

  const handleMapClick = (position: Coordinate) => {
    setTempLocation(position)
  }

  const handleConfirm = () => {
    if (tempLocation) {
      onChange?.(tempLocation)
    }
    setIsOpen(false)
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {value ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Select Location</h3>
              <p className="text-sm text-gray-500">Click on the map to select a location</p>
            </div>

            <Map
              center={tempLocation || { lat: 40.4168, lng: -3.7038 }}
              zoom={tempLocation ? 15 : 10}
              height={400}
              markers={tempLocation ? [{
                id: 'selected',
                position: tempLocation,
                color: '#ef4444'
              }] : []}
              onMapClick={handleMapClick}
            />

            <div className="p-4 border-t flex justify-between items-center">
              {tempLocation && (
                <span className="text-sm text-gray-600">
                  {tempLocation.lat.toFixed(6)}, {tempLocation.lng.toFixed(6)}
                </span>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!tempLocation}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Mini map preview
interface MiniMapProps {
  center: Coordinate
  zoom?: number
  size?: number
  onClick?: () => void
  className?: string
}

export function MiniMap({
  center,
  zoom = 15,
  size = 120,
  onClick,
  className = ''
}: MiniMapProps) {
  return (
    <div
      onClick={onClick}
      className={\`relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity \${className}\`}
      style={{ width: size, height: size }}
    >
      <Map
        center={center}
        zoom={zoom}
        height={size}
        interactive={false}
        markers={[{ id: 'center', position: center }]}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
        <span className="text-white text-sm font-medium">View map</span>
      </div>
    </div>
  )
}

// Declare global Leaflet
declare global {
  interface Window {
    L: any
  }
}
`
        }
      ]
    },
    ios: {
      framework: 'swiftui',
      minimumVersion: '15.0',
      dependencies: ['MapKit'],
      files: [
        {
          filename: 'Map.swift',
          code: `import SwiftUI
import MapKit
import CoreLocation

// MARK: - Map View
struct HubLabMap: View {
    @Binding var region: MKCoordinateRegion
    var markers: [MapMarker] = []
    var showUserLocation: Bool = false
    var interactionModes: MapInteractionModes = .all
    var onMarkerTap: ((MapMarker) -> Void)?
    var onMapTap: ((CLLocationCoordinate2D) -> Void)?

    @State private var selectedMarker: MapMarker?

    var body: some View {
        Map(coordinateRegion: $region,
            interactionModes: interactionModes,
            showsUserLocation: showUserLocation,
            annotationItems: markers) { marker in
            MapAnnotation(coordinate: marker.coordinate) {
                MarkerView(marker: marker, isSelected: selectedMarker?.id == marker.id)
                    .onTapGesture {
                        selectedMarker = marker
                        onMarkerTap?(marker)
                    }
            }
        }
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
}

// MARK: - Map Marker
struct MapMarker: Identifiable {
    let id: String
    let coordinate: CLLocationCoordinate2D
    var title: String?
    var subtitle: String?
    var color: Color = .blue
    var icon: String?
}

// MARK: - Marker View
struct MarkerView: View {
    var marker: MapMarker
    var isSelected: Bool = false

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                Circle()
                    .fill(marker.color)
                    .frame(width: isSelected ? 40 : 32, height: isSelected ? 40 : 32)
                    .shadow(color: marker.color.opacity(0.4), radius: 4, x: 0, y: 2)

                if let icon = marker.icon {
                    Image(systemName: icon)
                        .foregroundColor(.white)
                        .font(.system(size: isSelected ? 18 : 14, weight: .semibold))
                } else {
                    Circle()
                        .fill(Color.white)
                        .frame(width: isSelected ? 14 : 10, height: isSelected ? 14 : 10)
                }
            }

            // Pin point
            Triangle()
                .fill(marker.color)
                .frame(width: 12, height: 8)
                .offset(y: -2)
        }
        .animation(.spring(response: 0.3), value: isSelected)
    }
}

// MARK: - Triangle Shape
struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.closeSubpath()
        return path
    }
}

// MARK: - Location Picker
struct LocationPicker: View {
    @Binding var selectedLocation: CLLocationCoordinate2D?
    var placeholder: String = "Select a location"
    var onSelect: ((CLLocationCoordinate2D) -> Void)?

    @State private var showMap = false
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 40.4168, longitude: -3.7038),
        span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )
    @State private var tempLocation: CLLocationCoordinate2D?

    var body: some View {
        Button {
            showMap = true
        } label: {
            HStack {
                Image(systemName: "mappin.circle.fill")
                    .foregroundColor(.blue)

                if let location = selectedLocation {
                    Text(String(format: "%.4f, %.4f", location.latitude, location.longitude))
                        .foregroundColor(.primary)
                } else {
                    Text(placeholder)
                        .foregroundColor(.gray)
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .foregroundColor(.gray)
                    .font(.caption)
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .sheet(isPresented: $showMap) {
            NavigationStack {
                ZStack {
                    Map(coordinateRegion: $region,
                        annotationItems: tempLocation.map { [MapMarker(id: "temp", coordinate: $0, color: .red)] } ?? []) { marker in
                        MapAnnotation(coordinate: marker.coordinate) {
                            MarkerView(marker: marker, isSelected: true)
                        }
                    }
                    .ignoresSafeArea(edges: .bottom)
                    .onTapGesture { location in
                        // Note: MapKit doesn't directly support tap coordinates
                        // This is simplified - in production use gesture recognizer
                    }

                    // Center indicator for location selection
                    VStack {
                        Spacer()
                        Image(systemName: "plus")
                            .font(.title2)
                            .foregroundColor(.gray)
                        Spacer()
                    }

                    // Info card
                    if let temp = tempLocation {
                        VStack {
                            Spacer()
                            HStack {
                                VStack(alignment: .leading) {
                                    Text("Selected Location")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                    Text(String(format: "%.6f, %.6f", temp.latitude, temp.longitude))
                                        .font(.subheadline)
                                        .fontWeight(.medium)
                                }
                                Spacer()
                            }
                            .padding()
                            .background(.ultraThinMaterial)
                            .cornerRadius(12)
                            .padding()
                        }
                    }
                }
                .navigationTitle("Select Location")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") {
                            showMap = false
                        }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Select") {
                            // Use center of visible region
                            let centerLocation = region.center
                            selectedLocation = centerLocation
                            onSelect?(centerLocation)
                            showMap = false
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Mini Map
struct MiniMap: View {
    var coordinate: CLLocationCoordinate2D
    var size: CGFloat = 120
    var onTap: (() -> Void)?

    @State private var region: MKCoordinateRegion

    init(coordinate: CLLocationCoordinate2D, size: CGFloat = 120, onTap: (() -> Void)? = nil) {
        self.coordinate = coordinate
        self.size = size
        self.onTap = onTap
        self._region = State(initialValue: MKCoordinateRegion(
            center: coordinate,
            span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)
        ))
    }

    var body: some View {
        Map(coordinateRegion: .constant(region),
            interactionModes: [],
            annotationItems: [MapMarker(id: "center", coordinate: coordinate)]) { marker in
            MapAnnotation(coordinate: marker.coordinate) {
                Circle()
                    .fill(Color.blue)
                    .frame(width: 12, height: 12)
                    .overlay(Circle().stroke(Color.white, lineWidth: 2))
            }
        }
        .frame(width: size, height: size)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
        .onTapGesture {
            onTap?()
        }
    }
}

// MARK: - Location Manager
class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()

    @Published var location: CLLocationCoordinate2D?
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
    }

    func requestPermission() {
        manager.requestWhenInUseAuthorization()
    }

    func startUpdating() {
        manager.startUpdatingLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        location = locations.first?.coordinate
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        authorizationStatus = manager.authorizationStatus
    }
}

// MARK: - Preview
struct Map_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            HubLabMap(
                region: .constant(MKCoordinateRegion(
                    center: CLLocationCoordinate2D(latitude: 40.4168, longitude: -3.7038),
                    span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
                )),
                markers: [
                    MapMarker(id: "1", coordinate: CLLocationCoordinate2D(latitude: 40.4168, longitude: -3.7038), title: "Madrid")
                ]
            )
            .frame(height: 300)

            LocationPicker(selectedLocation: .constant(nil))

            MiniMap(coordinate: CLLocationCoordinate2D(latitude: 40.4168, longitude: -3.7038))
        }
        .padding()
    }
}
`
        }
      ]
    },
    android: {
      framework: 'compose',
      minimumVersion: '24',
      dependencies: ['com.google.maps.android:maps-compose', 'com.google.android.gms:play-services-maps'],
      files: [
        {
          filename: 'Map.kt',
          code: `package com.hublab.capsules

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*

data class MapMarkerData(
    val id: String,
    val position: LatLng,
    val title: String? = null,
    val snippet: String? = null,
    val color: Color = Color(0xFF3B82F6)
)

@Composable
fun HubLabMap(
    modifier: Modifier = Modifier,
    center: LatLng = LatLng(40.4168, -3.7038),
    zoom: Float = 13f,
    markers: List<MapMarkerData> = emptyList(),
    onMarkerClick: ((MapMarkerData) -> Unit)? = null,
    onMapClick: ((LatLng) -> Unit)? = null,
    showMyLocation: Boolean = false,
    uiSettings: MapUiSettings = MapUiSettings(
        zoomControlsEnabled = true,
        myLocationButtonEnabled = showMyLocation
    ),
    properties: MapProperties = MapProperties(
        isMyLocationEnabled = showMyLocation
    )
) {
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(center, zoom)
    }

    GoogleMap(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp)),
        cameraPositionState = cameraPositionState,
        uiSettings = uiSettings,
        properties = properties,
        onMapClick = { latLng ->
            onMapClick?.invoke(latLng)
        }
    ) {
        markers.forEach { markerData ->
            Marker(
                state = MarkerState(position = markerData.position),
                title = markerData.title,
                snippet = markerData.snippet,
                onClick = {
                    onMarkerClick?.invoke(markerData)
                    true
                }
            )
        }
    }
}

// Location Picker Component
@Composable
fun LocationPicker(
    selectedLocation: LatLng?,
    onLocationSelected: (LatLng) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Select a location"
) {
    var showMap by remember { mutableStateOf(false) }
    var tempLocation by remember { mutableStateOf(selectedLocation) }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clickable { showMap = true },
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.LocationOn,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary
            )

            Spacer(modifier = Modifier.width(12.dp))

            Text(
                text = selectedLocation?.let {
                    String.format("%.4f, %.4f", it.latitude, it.longitude)
                } ?: placeholder,
                color = if (selectedLocation != null)
                    MaterialTheme.colorScheme.onSurface
                else
                    MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                modifier = Modifier.weight(1f)
            )
        }
    }

    if (showMap) {
        Dialog(onDismissRequest = { showMap = false }) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight(0.8f),
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surface
            ) {
                Column {
                    // Header
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Select Location",
                            style = MaterialTheme.typography.titleLarge
                        )

                        TextButton(onClick = { showMap = false }) {
                            Text("Cancel")
                        }
                    }

                    // Map
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth()
                    ) {
                        HubLabMap(
                            modifier = Modifier.fillMaxSize(),
                            center = tempLocation ?: LatLng(40.4168, -3.7038),
                            markers = tempLocation?.let {
                                listOf(MapMarkerData(
                                    id = "selected",
                                    position = it,
                                    color = Color.Red
                                ))
                            } ?: emptyList(),
                            onMapClick = { latLng ->
                                tempLocation = latLng
                            }
                        )

                        // Center crosshair
                        Icon(
                            imageVector = Icons.Default.MyLocation,
                            contentDescription = "Center",
                            tint = Color.Gray.copy(alpha = 0.5f),
                            modifier = Modifier.align(Alignment.Center)
                        )
                    }

                    // Footer
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        tempLocation?.let {
                            Text(
                                text = String.format("%.6f, %.6f", it.latitude, it.longitude),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                            )
                        } ?: Spacer(modifier = Modifier.width(1.dp))

                        Button(
                            onClick = {
                                tempLocation?.let {
                                    onLocationSelected(it)
                                    showMap = false
                                }
                            },
                            enabled = tempLocation != null
                        ) {
                            Text("Select")
                        }
                    }
                }
            }
        }
    }
}

// Mini Map Preview
@Composable
fun MiniMap(
    location: LatLng,
    modifier: Modifier = Modifier,
    size: Int = 120,
    onClick: (() -> Unit)? = null
) {
    Box(
        modifier = modifier
            .size(size.dp)
            .clip(RoundedCornerShape(12.dp))
            .border(1.dp, Color.Gray.copy(alpha = 0.2f), RoundedCornerShape(12.dp))
            .clickable(enabled = onClick != null) { onClick?.invoke() }
    ) {
        HubLabMap(
            modifier = Modifier.fillMaxSize(),
            center = location,
            zoom = 15f,
            markers = listOf(
                MapMarkerData(
                    id = "center",
                    position = location
                )
            ),
            uiSettings = MapUiSettings(
                zoomControlsEnabled = false,
                scrollGesturesEnabled = false,
                zoomGesturesEnabled = false,
                tiltGesturesEnabled = false,
                rotationGesturesEnabled = false
            )
        )

        // Overlay for click indication
        if (onClick != null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.1f))
            )
        }
    }
}

// Address Display with Map
@Composable
fun AddressCard(
    address: String,
    location: LatLng,
    modifier: Modifier = Modifier,
    onMapClick: (() -> Unit)? = null
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surface,
        shadowElevation = 2.dp
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            MiniMap(
                location = location,
                size = 80,
                onClick = onMapClick
            )

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Address",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = address,
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }
    }
}
`
        }
      ]
    },
    desktop: {
      framework: 'tauri',
      dependencies: ['@tauri-apps/api', 'leaflet'],
      files: [
        {
          filename: 'Map.tsx',
          code: `// Desktop uses the same Leaflet-based React components
export { Map, StaticMap, LocationPicker, MiniMap } from './Map'
`
        }
      ]
    }
  },
  props: [
    { name: 'center', type: 'Coordinate', description: 'Center coordinates { lat, lng }' },
    { name: 'zoom', type: 'number', description: 'Zoom level (1-20)', default: 13 },
    { name: 'markers', type: 'Marker[]', description: 'Array of markers to display' },
    { name: 'onMarkerClick', type: '(marker: Marker) => void', description: 'Callback when marker is clicked' },
    { name: 'onMapClick', type: '(position: Coordinate) => void', description: 'Callback when map is clicked' },
    { name: 'showUserLocation', type: 'boolean', description: 'Show user location', default: false },
    { name: 'interactive', type: 'boolean', description: 'Enable map interactions', default: true },
    { name: 'height', type: 'number | string', description: 'Map height', default: 400 },
    { name: 'style', type: "'streets' | 'satellite' | 'terrain' | 'dark'", description: 'Map style', default: 'streets' }
  ],
  examples: [
    {
      title: 'Basic Map',
      code: `<Map
  center={{ lat: 40.4168, lng: -3.7038 }}
  zoom={14}
  markers={[
    { id: '1', position: { lat: 40.4168, lng: -3.7038 }, title: 'Madrid' }
  ]}
/>`
    },
    {
      title: 'Location Picker',
      code: `<LocationPicker
  value={location}
  onChange={setLocation}
  placeholder="Select delivery location"
/>`
    },
    {
      title: 'Mini Map Preview',
      code: `<MiniMap
  center={{ lat: 40.4168, lng: -3.7038 }}
  size={120}
  onClick={() => openFullMap()}
/>`
    }
  ]
}
