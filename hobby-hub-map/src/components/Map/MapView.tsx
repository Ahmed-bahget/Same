import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap, Circle } from 'react-leaflet';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define proper TypeScript interfaces
interface Location {
  lat: number;
  lng: number;
  address?: string;
  coverageRadius?: number;
}

interface PlaceProps {
  id: string;
  name: string;
  category: string;
  location: Location;
  [key: string]: any; // for any additional properties
}

// Configure default Leaflet icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  places?: PlaceProps[]; // Make optional with default value
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (id: string, type: 'place' | 'event') => void;
  selectedPlace?: string | null;
  showInfoOnHover?: boolean;
  showRadius?: boolean | number;
}

// Helper function to get SVG path for category icons
const getCategoryPath = (category: string) => {
  switch (category) {
    case 'flat':
      return '<rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M3 9h18"/>';
    case 'restaurant':
      return '<path d="M7 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2M1 2h22M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>';
    case 'shop':
      return '<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9v2h18V9"/><path d="M15 4V2M9 4V2"/>';
    case 'venue':
      return '<rect x="2" y="7" width="20" height="14" rx="2" /><path d="M6 7V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3"/>';
    case 'broker':
      return '<path d="M2 12.5V12c0-3.5 2.5-6 6-6 5 0 8.5 2.5 8.5 8 0 3-2 5-5 5H6a4 4 0 0 1-4-4Z"/><path d="M15 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z"/>';
    case 'deliverer':
      return '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M16 2v4M8 2v4M2 10h20"/>';
    default:
      return '<circle cx="12" cy="12" r="10"/>';
  }
};

// Create custom markers for different categories
const getCategoryIcon = (category: string) => {
  const colors: Record<string, string> = {
    'flat': '#3B82F6',
    'villa': '#8B5CF6',
    'restaurant': '#EF4444',
    'shop': '#EC4899',
    'venue': '#10B981',
    'broker': '#F59E0B',
    'deliverer': '#6366F1',
  };

  const color = colors[category] || '#6B7280';
  
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${getCategoryPath(category)}
            </svg>
          </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

interface RecenterMapProps {
  center: { lat: number; lng: number } | null;
  zoom?: number;
}

const RecenterMap: React.FC<RecenterMapProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], zoom || map.getZoom());
    }
  }, [center, map, zoom]);
  
  return null;
};

const MapView: React.FC<MapViewProps> = ({ 
  places = [], 
  center, 
  zoom = 13, 
  onMarkerClick, 
  selectedPlace,
  showInfoOnHover = false,
  showRadius = false
}) => {
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const popupRefs = useRef<{ [key: string]: L.Popup | null }>({});
  
  // Set initial center based on props or first place
  useEffect(() => {
    if (center) {
      setMapCenter(center);
    } else if (places && places.length > 0 && places[0].location) {
      setMapCenter(places[0].location);
    } else {
      // Default to London if no places or invalid data
      setMapCenter({ lat: 51.505, lng: -0.09 });
    }
  }, [center, places?.length]); // Only depend on places length, not the entire places array
  
  // When selected place changes, update map center and open popup
  useEffect(() => {
    if (selectedPlace && places) {
      const place = places.find(p => p.id === selectedPlace);
      if (place && place.location) {
        setMapCenter(place.location);
        
        // Open the popup for this place
        const popup = popupRefs.current[place.id];
        if (popup) {
          popup.openOn(popup._map);
        }
      }
    }
  }, [selectedPlace, places]);
  
  if (!mapCenter) {
    return <div className="flex items-center justify-center h-full">Loading map...</div>;
  }
  
  return (
    <MapContainer 
      center={[mapCenter.lat, mapCenter.lng]} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
      key={`${mapCenter.lat}-${mapCenter.lng}`} // Force re-render on center change
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <RecenterMap center={mapCenter} zoom={zoom} />
      
      {places && places.map((place) => {
        if (!place.location) return null;
        
        const isSelected = selectedPlace === place.id;
        const placeRadius = typeof showRadius === 'number' ? 
          showRadius * 1000 : // Convert km to meters
          place.location.coverageRadius ? 
            place.location.coverageRadius * 1000 : // Convert km to meters
            0;
            
        return (
          <React.Fragment key={place.id}>
            <Marker 
              position={[place.location.lat, place.location.lng]}
              icon={getCategoryIcon(place.category)}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) {
                    onMarkerClick(place.id, 'place');
                  }
                },
                mouseover: (e) => {
                  if (showInfoOnHover) {
                    const popup = popupRefs.current[place.id];
                    if (popup) {
                      popup.openOn(e.target._map);
                    }
                  }
                },
                mouseout: (e) => {
                  if (showInfoOnHover && !isSelected) {
                    const popup = popupRefs.current[place.id];
                    if (popup) {
                      e.target._map.closePopup(popup);
                    }
                  }
                }
              }}
            >
              <Popup
                ref={(ref) => { popupRefs.current[place.id] = ref; }}
                className="custom-popup"
              >
                <div className="text-center">
                  <div className="font-semibold">{place.name}</div>
                  {place.location.address && (
                    <div className="text-xs text-gray-600 mt-1">{place.location.address}</div>
                  )}
                </div>
              </Popup>
            </Marker>
            
            {showRadius && placeRadius > 0 && (
              <Circle 
                center={[place.location.lat, place.location.lng]}
                radius={placeRadius}
                pathOptions={{ 
                  fillColor: '#3B82F690', 
                  fillOpacity: 0.1, 
                  color: '#3B82F6',
                  weight: 1
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default MapView;







// import React, { useEffect, useRef, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap, Circle } from 'react-leaflet';
// import { PlaceProps } from '@/types/place';
// import { PlaceCategoryIcon } from '@/components/Places/PlaceCategoryIcon';

// // Fix for Leaflet marker icons
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// let DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// interface MapViewProps {
//   places: PlaceProps[];
//   center?: { lat: number; lng: number };
//   zoom?: number;
//   onMarkerClick?: (id: string, type: 'place' | 'event') => void;
//   selectedPlace?: string | null;
//   showInfoOnHover?: boolean;
//   showRadius?: boolean | number; // Can be true to use place's radius or a specific value in km
// }

// // Create custom markers for different categories
// const getCategoryIcon = (category: string) => {
//   const colors: Record<string, string> = {
//     'flat': '#3B82F6', // blue
//     'villa': '#8B5CF6', // purple
//     'restaurant': '#EF4444', // red
//     'shop': '#EC4899', // pink
//     'venue': '#10B981', // green
//     'broker': '#F59E0B', // amber
//     'deliverer': '#6366F1', // indigo
//   };

//   const color = colors[category] || '#6B7280'; // gray default
  
//   return L.divIcon({
//     className: 'custom-marker-icon',
//     html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//               ${getCategoryPath(category)}
//             </svg>
//           </div>`,
//     iconSize: [30, 30],
//     iconAnchor: [15, 15],
//   });
// };

// const getCategoryPath = (category: string) => {
//   switch (category) {
//     case 'flat':
//       return '<rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M3 9h18"/>';
//     case 'restaurant':
//       return '<path d="M7 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2M1 2h22M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>';
//     case 'shop':
//       return '<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9v2h18V9"/><path d="M15 4V2M9 4V2"/>';
//     case 'venue':
//       return '<rect x="2" y="7" width="20" height="14" rx="2" /><path d="M6 7V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3"/>';
//     case 'broker':
//       return '<path d="M2 12.5V12c0-3.5 2.5-6 6-6 5 0 8.5 2.5 8.5 8 0 3-2 5-5 5H6a4 4 0 0 1-4-4Z"/><path d="M15 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z"/>';
//     case 'deliverer':
//       return '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M16 2v4M8 2v4M2 10h20"/>';
//     default:
//       return '<circle cx="12" cy="12" r="10"/>';
//   }
// };

// interface RecenterMapProps {
//   center: { lat: number; lng: number } | null;
//   zoom?: number;
// }

// const RecenterMap: React.FC<RecenterMapProps> = ({ center, zoom }) => {
//   const map = useMap();
  
//   useEffect(() => {
//     if (center) {
//       map.setView([center.lat, center.lng], zoom || map.getZoom());
//     }
//   }, [center, map, zoom]);
  
//   return null;
// };

// const MapView: React.FC<MapViewProps> = ({ 
//   places, 
//   center, 
//   zoom = 13, 
//   onMarkerClick, 
//   selectedPlace,
//   showInfoOnHover = false,
//   showRadius = false
// }) => {
//   const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
//   const popupRefs = useRef<{ [key: string]: L.Popup | null }>({});
  
//   // Set initial center based on props or first place
//   useEffect(() => {
//     if (center) {
//       setMapCenter(center);
//     } else if (places && places.length > 0) {
//       setMapCenter(places[0].location);
//     } else {
//       // Default to London if no places
//       setMapCenter({ lat: 51.505, lng: -0.09 });
//     }
//   }, [center, places]);
  
//   // When selected place changes, update map center and open popup
//   useEffect(() => {
//     if (selectedPlace) {
//       const place = places.find(p => p.id === selectedPlace);
//       if (place) {
//         setMapCenter(place.location);
        
//         // Open the popup for this place
//         const popup = popupRefs.current[place.id];
//         if (popup) {
//           popup.openOn(popup._map);
//         }
//       }
//     }
//   }, [selectedPlace, places]);
  
//   if (!mapCenter) {
//     return <div>Loading map...</div>;
//   }
  
//   return (
//     <MapContainer 
//       center={[mapCenter.lat, mapCenter.lng]} 
//       zoom={zoom} 
//       style={{ height: '100%', width: '100%' }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
      
//       <RecenterMap center={mapCenter} zoom={zoom} />
      
//       {places.map((place) => {
//         const isSelected = selectedPlace === place.id;
//         const placeRadius = typeof showRadius === 'number' ? 
//           showRadius * 1000 : // Convert km to meters
//           (place.location as any).coverageRadius ? 
//             (place.location as any).coverageRadius * 1000 : // Convert km to meters
//             0;
            
//         return (
//           <React.Fragment key={place.id}>
//             <Marker 
//               position={[place.location.lat, place.location.lng]}
//               icon={getCategoryIcon(place.category)}
//               eventHandlers={{
//                 click: () => {
//                   if (onMarkerClick) {
//                     onMarkerClick(place.id, 'place');
//                   }
//                 },
//                 mouseover: (e) => {
//                   if (showInfoOnHover) {
//                     const popup = popupRefs.current[place.id];
//                     if (popup) {
//                       popup.openOn(e.target._map);
//                     }
//                   }
//                 },
//                 mouseout: (e) => {
//                   if (showInfoOnHover && !isSelected) {
//                     const popup = popupRefs.current[place.id];
//                     if (popup) {
//                       e.target._map.closePopup(popup);
//                     }
//                   }
//                 }
//               }}
//             >
//               <Popup
//                 ref={(ref) => { popupRefs.current[place.id] = ref; }}
//                 className="custom-popup"
//               >
//                 <div className="text-center">
//                   <div className="font-semibold">{place.name}</div>
//                   {place.location.address && (
//                     <div className="text-xs text-gray-600 mt-1">{place.location.address}</div>
//                   )}
//                 </div>
//               </Popup>
//             </Marker>
            
//             {showRadius && placeRadius > 0 && (
//               <Circle 
//                 center={[place.location.lat, place.location.lng]}
//                 radius={placeRadius}
//                 pathOptions={{ 
//                   fillColor: '#3B82F690', 
//                   fillOpacity: 0.1, 
//                   color: '#3B82F6',
//                   weight: 1
//                 }}
//               />
//             )}
//           </React.Fragment>
//         );
//       })}
//     </MapContainer>
//   );
// };

// export default MapView;






// import React, { useEffect, useRef, useState } from 'react';
// import { MapPin, User, Gamepad, Camera, Music, Video, Utensils, Tent, Ticket, Palette, Music2, Coffee, Monitor, Users } from 'lucide-react';
// import { useMap } from '@/hooks/useMap';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';


// // Updated Event interface to match actual event structure in the application
// interface Event {
//   id: string;
//   title: string;
//   hobbyType: string;
//   location: {
//     lat: number;
//     lng: number;
//     address?: string;
//   };
//   date: string;
//   time?: string;
//   attendees: Array<{
//     id: string;
//     username: string;
//     profileImage?: string;
//     hobbies?: string[];
//   }>;
// }

// // New Place interface for locations
// interface Place {
//   id: string;
//   name: string;
//   description: string;
//   type: string; // regular, event, rent, sell
//   hobbyType?: string;
//   location: {
//     lat: number;
//     lng: number;
//     address?: string;
//   };
//   createdBy: {
//     id: string;
//     username: string;
//   };
//   images?: string[];
// }

// interface MapViewProps {
//   events?: Event[];
//   places?: Place[];
//   onMarkerClick?: (id: string, type: 'event' | 'place') => void;
//   selectedEvent?: string | null;
//   selectedPlace?: string | null;
//   center?: { lat: number; lng: number } | null;
//   zoom?: number;
//   showInfoOnHover?: boolean;
// }

// const MapView: React.FC<MapViewProps> = ({
//   events = [],
//   places = [],
//   onMarkerClick,
//   selectedEvent = null,
//   selectedPlace = null,
//   center = null,
//   zoom = 13,
//   showInfoOnHover = true
// }) => {
//   const mapContainerRef = useRef<HTMLDivElement>(null);
//   const { userLocation, getUserLocation } = useMap();
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [mapInstance, setMapInstance] = useState<any>(null);
//   const markersRef = useRef<any[]>([]);
//   const infoWindowsRef = useRef<any[]>([]);
//   const [hoveredItem, setHoveredItem] = useState<{id: string, type: 'event' | 'place'} | null>(null);

//   useEffect(() => {
//     // Load Google Maps script
//     if (!document.getElementById('google-maps-script')) {
//       const script = document.createElement('script');
//       script.id = 'google-maps-script';
//       script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCc5aMBgtiM2g9iwclD7jzCLncv94mnTu4&libraries=places`;
//       script.async = true;
//       script.defer = true;
//       script.onload = () => setMapLoaded(true);
      
//       document.head.appendChild(script);
//     } else if ((window as any).google && (window as any).google.maps) {
//       setMapLoaded(true);
//     }
    
//     return () => {
//       // Clean up markers and infowindows on unmount
//       if (markersRef.current) {
//         markersRef.current.forEach(marker => {
//           if (marker) marker.setMap(null);
//         });
//       }
      
//       if (infoWindowsRef.current) {
//         infoWindowsRef.current.forEach(infoWindow => {
//           if (infoWindow) infoWindow.close();
//         });
//       }
//     };
//   }, []);

//   useEffect(() => {
//     // Initialize map
//     if (mapLoaded && mapContainerRef.current && !mapInstance) {
//       getUserLocation();
      
//       const initialCenter = center || userLocation || { lat: 51.505, lng: -0.09 }; // Default to London
      
//       const mapOptions = {
//         center: initialCenter,
//         zoom: zoom,
//         mapTypeId: (window as any).google.maps.MapTypeId.ROADMAP,
//         disableDefaultUI: true,
//         zoomControl: true,
//         mapTypeControl: false,
//         streetViewControl: false,
//         styles: [
//           {
//             featureType: 'poi',
//             elementType: 'labels',
//             stylers: [{ visibility: 'off' }]
//           },
//           {
//             featureType: 'water',
//             elementType: 'geometry',
//             stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
//           }
//         ]
//       };

//       const map = new (window as any).google.maps.Map(mapContainerRef.current, mapOptions);
//       setMapInstance(map);
//     }
//   }, [mapLoaded, userLocation, center, zoom, getUserLocation, mapInstance]);

//   // Update getHobbyIcon to use the new HobbyIcon component
//   const getHobbyIcon = (hobbyType: string): JSX.Element => {
//     const hobbyIcons: Record<string, JSX.Element> = {
//       'sports': <Palette className="h-full w-full" />,
//       'arts': <Palette className="h-full w-full" />,
//       'music': <Music2 className="h-full w-full" />,
//       'cooking': <Coffee className="h-full w-full" />,
//       'gaming': <Gamepad className="h-full w-full" />,
//       'tech': <Monitor className="h-full w-full" />,
//       'outdoor': <Tent className="h-full w-full" />,
//       'social': <Users className="h-full w-full" />,
//     };
    
//     return hobbyIcons[hobbyType.toLowerCase()] || <MapPin className="h-full w-full" />;
//   };

//   // Get color for hobby type
//   const getHobbyColor = (hobbyType: string): string => {
//     const hobbyColors: Record<string, string> = {
//       'sports': '#FF5A5F',
//       'arts': '#FFB400',
//       'music': '#8A2BE2',
//       'cooking': '#FF8C00',
//       'gaming': '#1E90FF',
//       'tech': '#00CED1',
//       'outdoor': '#3CB371',
//       'social': '#FF69B4',
//     };
    
//     return hobbyColors[hobbyType.toLowerCase()] || '#319795';
//   };

//   // Get place icon based on type
//   const getPlaceTypeIcon = (place: Place): any => {
//     if (place.type === 'event') {
//       return {
//         path: (window as any).google.maps.SymbolPath.CIRCLE,
//         fillColor: getHobbyColor(place.hobbyType || 'default'),
//         fillOpacity: 0.7,
//         strokeWeight: 2,
//         strokeColor: '#FFFFFF',
//         scale: 10,
//       };
//     } else if (place.type === 'rent') {
//       return {
//         path: (window as any).google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
//         fillColor: '#4285F4',
//         fillOpacity: 0.7,
//         strokeWeight: 2,
//         strokeColor: '#FFFFFF',
//         scale: 7,
//       };
//     } else if (place.type === 'sell') {
//       return {
//         path: (window as any).google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
//         fillColor: '#DB4437',
//         fillOpacity: 0.7,
//         strokeWeight: 2,
//         strokeColor: '#FFFFFF',
//         scale: 7,
//       };
//     } else {
//       return {
//         path: (window as any).google.maps.SymbolPath.CIRCLE,
//         fillColor: '#34A853',
//         fillOpacity: 0.7,
//         strokeWeight: 1,
//         strokeColor: '#FFFFFF',
//         scale: 8,
//       };
//     }
//   };

//   // Create HTML content for info window
//   const createEventInfoContent = (event: Event): string => {
//     return `
//       <div class="p-3 max-w-xs">
//         <h3 class="font-bold text-sm mb-1">${event.title}</h3>
//         <div class="text-xs text-gray-600 mb-1">
//           <span>${event.date}</span>
//           ${event.time ? ` • <span>${event.time}</span>` : ''}
//         </div>
//         <div class="text-xs text-gray-600">
//           ${event.attendees.length} attendees
//         </div>
//       </div>
//     `;
//   };

//   const createPlaceInfoContent = (place: Place): string => {
//     return `
//       <div class="p-3 max-w-xs">
//         <h3 class="font-bold text-sm mb-1">${place.name}</h3>
//         <div class="text-xs text-gray-600 mb-1">
//           ${place.location.address || ''}
//         </div>
//         <div class="text-xs text-gray-600">
//           ${place.type === 'rent' ? 'Available for rent' : 
//            place.type === 'sell' ? 'For sale' : 
//            place.type === 'event' ? 'Event venue' : 'Regular place'}
//         </div>
//       </div>
//     `;
//   };

//   // Update the markers creation with unique infowindows
//   useEffect(() => {
//     if (mapInstance && events.length > 0) {
//       // Clear existing markers
//       markersRef.current.forEach(marker => marker?.setMap(null));
//       markersRef.current = [];
      
//       // Clear existing info windows
//       infoWindowsRef.current.forEach(infoWindow => infoWindow?.close());
//       infoWindowsRef.current = [];
      
//       // Create new markers for events
//       events.forEach((event, index) => {
//         const isSelected = event.id === selectedEvent;
        
//         const markerIcon = {
//           path: (window as any).google.maps.SymbolPath.CIRCLE,
//           fillColor: getHobbyColor(event.hobbyType),
//           fillOpacity: isSelected ? 1 : 0.7,
//           strokeWeight: isSelected ? 2 : 1,
//           strokeColor: '#FFFFFF',
//           scale: isSelected ? 12 : 10,
//         };
        
//         const marker = new (window as any).google.maps.Marker({
//           position: event.location,
//           map: mapInstance,
//           title: event.title,
//           icon: markerIcon,
//           animation: isSelected ? (window as any).google.maps.Animation.BOUNCE : null,
//           zIndex: isSelected ? 999 : 1
//         });
        
//         // Create a unique info window for this marker
//         const infoWindow = new (window as any).google.maps.InfoWindow({
//           content: createEventInfoContent(event),
//           maxWidth: 250
//         });
        
//         infoWindowsRef.current[index] = infoWindow;
        
//         marker.addListener('click', () => {
//           if (onMarkerClick) onMarkerClick(event.id, 'event');
//         });
        
//         if (showInfoOnHover) {
//           marker.addListener('mouseover', () => {
//             // Close all other info windows first
//             infoWindowsRef.current.forEach((window, idx) => {
//               if (idx !== index) window?.close();
//             });
//             infoWindow.open(mapInstance, marker);
//             setHoveredItem({ id: event.id, type: 'event' });
//           });
          
//           marker.addListener('mouseout', () => {
//             infoWindow.close();
//             setHoveredItem(null);
//           });
//         }
        
//         markersRef.current.push(marker);
//       });

//       // Add place markers if available
//       places.forEach(place => {
//         const isSelected = place.id === selectedPlace;
        
//         const marker = new (window as any).google.maps.Marker({
//           position: place.location,
//           map: mapInstance,
//           title: place.name,
//           icon: getPlaceTypeIcon(place),
//           animation: isSelected ? (window as any).google.maps.Animation.BOUNCE : null,
//           zIndex: isSelected ? 998 : 1
//         });
        
//         // Create info window for the place
//         const infoWindow = new (window as any).google.maps.InfoWindow({
//           content: createPlaceInfoContent(place),
//           maxWidth: 250
//         });
        
//         // Add to refs
//         infoWindowsRef.current.push(infoWindow);
        
//         // Add event listeners
//         marker.addListener('click', () => {
//           if (onMarkerClick) onMarkerClick(place.id, 'place');
//         });
        
//         if (showInfoOnHover) {
//           marker.addListener('mouseover', () => {
//             infoWindow.open(mapInstance, marker);
//             setHoveredItem({ id: place.id, type: 'place' });
//           });
          
//           marker.addListener('mouseout', () => {
//             infoWindow.close();
//             setHoveredItem(null);
//           });
//         }
        
//         markersRef.current.push(marker);
//       });
//     }
//   }, [mapInstance, events, places, selectedEvent, selectedPlace, onMarkerClick, showInfoOnHover]);

//   useEffect(() => {
//     // Add user location marker
//     if (mapInstance && userLocation) {
//       const userMarker = new (window as any).google.maps.Marker({
//         position: userLocation,
//         map: mapInstance,
//         title: 'Your Location',
//         icon: {
//           path: (window as any).google.maps.SymbolPath.CIRCLE,
//           fillColor: '#4285F4',
//           fillOpacity: 1,
//           strokeWeight: 2,
//           strokeColor: '#FFFFFF',
//           scale: 8,
//         },
//         zIndex: 1000
//       });
      
//       return () => {
//         if (userMarker) userMarker.setMap(null);
//       };
//     }
//   }, [mapInstance, userLocation]);

//   // No map API loaded placeholder
//   if (!mapLoaded) {
//     return (
//       <div ref={mapContainerRef} className="map-container flex items-center justify-center bg-gray-100">
//         <div className="text-center p-6">
//           <MapPin className="h-12 w-12 mx-auto mb-4 text-primary-500 animate-pulse" />
//           <p className="text-lg font-medium">Loading map...</p>
//         </div>
//       </div>
//     );
//   }

//   return <div ref={mapContainerRef} className="map-container" />;
// };

// export default MapView;
