/**
 * Location Capsule - Geolocation Services
 *
 * Cross-platform geolocation with real-time tracking,
 * geocoding, and geofencing capabilities.
 */

import type { CapsuleDefinition } from './types'

export const LocationCapsule: CapsuleDefinition = {
  id: 'location',
  name: 'Location',
  description: 'Geolocation services with tracking, geocoding, and geofencing',
  category: 'device',
  tags: ['location', 'gps', 'geolocation', 'tracking', 'maps'],
  version: '1.0.0',

  props: {
    enableHighAccuracy: {
      type: 'boolean',
      default: true,
      description: 'Use high accuracy GPS mode',
    },
    timeout: {
      type: 'number',
      default: 10000,
      description: 'Location request timeout in ms',
    },
    maximumAge: {
      type: 'number',
      default: 0,
      description: 'Maximum age of cached location in ms',
    },
    distanceFilter: {
      type: 'number',
      default: 10,
      description: 'Minimum distance change for updates (meters)',
    },
    watchPosition: {
      type: 'boolean',
      default: false,
      description: 'Continuously watch position changes',
    },
    showPermissionUI: {
      type: 'boolean',
      default: true,
      description: 'Show permission request UI',
    },
    onLocationChange: {
      type: 'function',
      description: 'Callback when location changes',
    },
    onError: {
      type: 'function',
      description: 'Callback when error occurs',
    },
  },

  platforms: {
    web: {
      dependencies: ['react', 'tailwindcss'],
      components: {
        useLocation: `
import { useState, useCallback, useEffect, useRef } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

interface LocationState {
  coordinates: Coordinates | null;
  timestamp: number | null;
  loading: boolean;
  error: string | null;
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

export function useLocation(options: UseLocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options;

  const [state, setState] = useState<LocationState>({
    coordinates: null,
    timestamp: null,
    loading: false,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
      },
      timestamp: position.timestamp,
      loading: false,
      error: null,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let message = 'Unknown error';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location permission denied';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location unavailable';
        break;
      case error.TIMEOUT:
        message = 'Location request timed out';
        break;
    }
    setState(prev => ({ ...prev, loading: false, error: message }));
  }, []);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation not supported' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) return;

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setState(prev => ({ ...prev, loading: true }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    if (watch) {
      startWatching();
    }
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [watch, startWatching]);

  return {
    ...state,
    getCurrentPosition,
    startWatching,
    stopWatching,
    isWatching: watchIdRef.current !== null,
  };
}
`,

        LocationButton: `
import React from 'react';
import { useLocation } from './useLocation';

interface LocationButtonProps {
  onLocation?: (coords: { latitude: number; longitude: number }) => void;
  onError?: (error: string) => void;
  label?: string;
  className?: string;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  onLocation,
  onError,
  label = 'Get My Location',
  className = '',
}) => {
  const { getCurrentPosition, coordinates, loading, error } = useLocation();

  React.useEffect(() => {
    if (coordinates) {
      onLocation?.({ latitude: coordinates.latitude, longitude: coordinates.longitude });
    }
  }, [coordinates, onLocation]);

  React.useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  return (
    <button
      onClick={getCurrentPosition}
      disabled={loading}
      className={\`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 \${className}\`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
      {loading ? 'Getting location...' : label}
    </button>
  );
};
`,

        LocationDisplay: `
import React from 'react';

interface LocationDisplayProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
  showCopyButton?: boolean;
  format?: 'decimal' | 'dms';
  className?: string;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  latitude,
  longitude,
  accuracy,
  showCopyButton = true,
  format = 'decimal',
  className = '',
}) => {
  const [copied, setCopied] = React.useState(false);

  const formatCoordinate = (value: number, isLat: boolean) => {
    if (format === 'decimal') {
      return value.toFixed(6);
    }

    const absolute = Math.abs(value);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
    const direction = isLat
      ? value >= 0 ? 'N' : 'S'
      : value >= 0 ? 'E' : 'W';

    return \`\${degrees}° \${minutes}' \${seconds}" \${direction}\`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(\`\${latitude}, \${longitude}\`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={\`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 \${className}\`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">Location</span>
        {showCopyButton && (
          <button
            onClick={copyToClipboard}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Latitude</span>
          <span className="font-mono">{formatCoordinate(latitude, true)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Longitude</span>
          <span className="font-mono">{formatCoordinate(longitude, false)}</span>
        </div>
        {accuracy && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
            <span className="font-mono">±{accuracy.toFixed(0)}m</span>
          </div>
        )}
      </div>
    </div>
  );
};
`,
      },
    },

    ios: {
      dependencies: ['SwiftUI', 'CoreLocation'],
      minimumVersion: '15.0',
      components: {
        LocationManager: `
import SwiftUI
import CoreLocation

@MainActor
class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    static let shared = LocationManager()

    @Published var location: CLLocation?
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined
    @Published var isLoading = false
    @Published var error: String?

    private let manager = CLLocationManager()

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        authorizationStatus = manager.authorizationStatus
    }

    func requestPermission() {
        manager.requestWhenInUseAuthorization()
    }

    func requestLocation() {
        isLoading = true
        error = nil
        manager.requestLocation()
    }

    func startUpdating() {
        isLoading = true
        manager.startUpdatingLocation()
    }

    func stopUpdating() {
        manager.stopUpdatingLocation()
        isLoading = false
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        Task { @MainActor in
            self.location = locations.last
            self.isLoading = false
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        Task { @MainActor in
            self.error = error.localizedDescription
            self.isLoading = false
        }
    }

    nonisolated func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        Task { @MainActor in
            self.authorizationStatus = manager.authorizationStatus
        }
    }
}

struct LocationButton: View {
    @StateObject private var manager = LocationManager.shared
    var onLocation: ((CLLocation) -> Void)?

    var body: some View {
        Button(action: {
            if manager.authorizationStatus == .notDetermined {
                manager.requestPermission()
            } else {
                manager.requestLocation()
            }
        }) {
            HStack {
                if manager.isLoading {
                    ProgressView()
                        .tint(.white)
                } else {
                    Image(systemName: "location.fill")
                }
                Text(manager.isLoading ? "Getting location..." : "Get My Location")
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(12)
        }
        .disabled(manager.isLoading)
        .onChange(of: manager.location) { location in
            if let location = location {
                onLocation?(location)
            }
        }
    }
}

struct LocationDisplay: View {
    let location: CLLocation

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Latitude")
                    .foregroundColor(.secondary)
                Spacer()
                Text(String(format: "%.6f", location.coordinate.latitude))
                    .font(.system(.body, design: .monospaced))
            }
            HStack {
                Text("Longitude")
                    .foregroundColor(.secondary)
                Spacer()
                Text(String(format: "%.6f", location.coordinate.longitude))
                    .font(.system(.body, design: .monospaced))
            }
            HStack {
                Text("Accuracy")
                    .foregroundColor(.secondary)
                Spacer()
                Text("±\\(Int(location.horizontalAccuracy))m")
                    .font(.system(.body, design: .monospaced))
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }
}
`,
      },
    },

    android: {
      dependencies: [
        'androidx.compose.ui:ui',
        'androidx.compose.material3:material3',
        'com.google.android.gms:play-services-location:21.0.1',
      ],
      minimumSdk: 24,
      components: {
        LocationManager: `
package com.hublab.capsules.location

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import com.google.android.gms.location.*

@SuppressLint("MissingPermission")
@Composable
fun LocationButton(
    onLocation: (Location) -> Unit,
    onError: (String) -> Unit = {},
    label: String = "Get My Location"
) {
    val context = LocalContext.current
    var isLoading by remember { mutableStateOf(false) }
    var hasPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == android.content.pm.PackageManager.PERMISSION_GRANTED
        )
    }

    val fusedLocationClient = remember {
        LocationServices.getFusedLocationProviderClient(context)
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasPermission = granted
        if (granted) {
            requestLocation(fusedLocationClient, onLocation, onError) { isLoading = it }
        } else {
            onError("Location permission denied")
        }
    }

    Button(
        onClick = {
            if (hasPermission) {
                requestLocation(fusedLocationClient, onLocation, onError) { isLoading = it }
            } else {
                permissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
            }
        },
        enabled = !isLoading
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                color = MaterialTheme.colorScheme.onPrimary
            )
        } else {
            Icon(Icons.Default.LocationOn, contentDescription = null)
        }
        Spacer(modifier = Modifier.width(8.dp))
        Text(if (isLoading) "Getting location..." else label)
    }
}

@SuppressLint("MissingPermission")
private fun requestLocation(
    client: FusedLocationProviderClient,
    onLocation: (Location) -> Unit,
    onError: (String) -> Unit,
    setLoading: (Boolean) -> Unit
) {
    setLoading(true)

    client.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, null)
        .addOnSuccessListener { location ->
            setLoading(false)
            if (location != null) {
                onLocation(location)
            } else {
                onError("Location unavailable")
            }
        }
        .addOnFailureListener { e ->
            setLoading(false)
            onError(e.message ?: "Failed to get location")
        }
}

@Composable
fun LocationDisplay(
    latitude: Double,
    longitude: Double,
    accuracy: Float? = null
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Latitude", color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(String.format("%.6f", latitude))
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Longitude", color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(String.format("%.6f", longitude))
            }
            accuracy?.let { acc ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Accuracy", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("±\${acc.toInt()}m")
                }
            }
        }
    }
}
`,
      },
    },

    desktop: {
      dependencies: ['tauri', 'react', 'tailwindcss'],
      components: {
        DesktopLocation: `
import React from 'react';

export function useLocation() {
  const [location, setLocation] = React.useState<GeolocationCoordinates | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getCurrentPosition = React.useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return { location, loading, error, getCurrentPosition };
}

export const LocationButton: React.FC<{
  onLocation?: (coords: { latitude: number; longitude: number }) => void;
}> = ({ onLocation }) => {
  const { location, loading, error, getCurrentPosition } = useLocation();

  React.useEffect(() => {
    if (location) {
      onLocation?.({ latitude: location.latitude, longitude: location.longitude });
    }
  }, [location, onLocation]);

  return (
    <button
      onClick={getCurrentPosition}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Getting location...' : 'Get My Location'}
    </button>
  );
};
`,
      },
    },
  },

  examples: [
    {
      title: 'Get Current Location',
      description: 'Get user location on button click',
      code: `
<LocationButton
  onLocation={(coords) => console.log(coords)}
  onError={(error) => console.error(error)}
/>
`,
    },
    {
      title: 'Display Coordinates',
      description: 'Show location with coordinates',
      code: `
<LocationDisplay
  latitude={40.7128}
  longitude={-74.0060}
  accuracy={15}
/>
`,
    },
  ],
}
