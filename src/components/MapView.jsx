// "use client"

// import { useEffect, useRef, useState } from "react"
// import maplibregl from "maplibre-gl"
// import "maplibre-gl/dist/maplibre-gl.css"
// import { Clock, CheckCircle, AlertCircle } from "lucide-react"

// /**
//  * IMPORTANT:
//  * 1. Add NEXT_PUBLIC_MAPBOX_TOKEN to your env (already in .env.example).
//  * 2. No `accessToken` property is needed on maplibre-gl itself, you
//  *    just embed the token in the style URL below.
//  */

// // ----- choose a style that always loads -----
// const MAP_STYLE = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
//   ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
//   : // Public demo style from MapLibre – no token required
//     "https://demotiles.maplibre.org/style.json"

// const statusColors = {
//   pending: { color: "#ef4444" },
//   "in-progress": { color: "#3b82f6" },
//   resolved: { color: "#10b981" },
// }

// const statusIcons = {
//   pending: Clock,
//   "in-progress": AlertCircle,
//   resolved: CheckCircle,
// }

// export default function MapboxMap({ issues, selectedIssue, onIssueSelect, onMapClick, userLocation }) {
//   const mapNode = useRef(null)
//   const mapRef = useRef(null)
//   const popupRef = useRef(null)
//   const [loaded, setLoaded] = useState(false)

//   /* ---------- initialise map ---------- */
//   useEffect(() => {
//     if (!mapNode.current || mapRef.current) return

//     mapRef.current = new maplibregl.Map({
//       container: mapNode.current,
//       style: MAP_STYLE,
//       center: userLocation || [-74.006, 40.7128],
//       zoom: 12,
//       attributionControl: false,
//     })

//     /* controls */
//     mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right")
//     mapRef.current.addControl(
//       new maplibregl.GeolocateControl({
//         positionOptions: { enableHighAccuracy: true },
//         trackUserLocation: true,
//         showUserHeading: true,
//       }),
//       "top-right",
//     )

//     mapRef.current.on("load", () => {
//       setLoaded(true)
//       createClusterSource()
//     })

//     mapRef.current.on("error", (e) => {
//       // swallow source/style load errors so the app doesn't crash
//       console.warn("Map error:", e?.error)
//     })

//     /* click-to-add */
//     mapRef.current.on("click", (e) => {
//       onMapClick?.([e.lngLat.lng, e.lngLat.lat])
//     })

//     return () => {
//       mapRef.current?.remove()
//       mapRef.current = null
//     }
//   }, [onMapClick, userLocation])

//   /* ---------- helpers ---------- */
//   const createClusterSource = () => {
//     if (!mapRef.current) return

//     mapRef.current.addSource("issues", {
//       type: "geojson",
//       data: featureCollection(issues),
//       cluster: true,
//       clusterRadius: 50,
//       clusterMaxZoom: 14,
//     })

//     /* clusters (circles) */
//     mapRef.current.addLayer({
//       id: "clusters",
//       type: "circle",
//       source: "issues",
//       filter: ["has", "point_count"],
//       paint: {
//         "circle-color": ["step", ["get", "point_count"], "#51bbd6", 10, "#f1c40f", 30, "#e74c3c"],
//         "circle-radius": ["step", ["get", "point_count"], 20, 10, 28, 30, 36],
//         "circle-stroke-width": 2,
//         "circle-stroke-color": "#fff",
//       },
//     })

//     /* cluster count labels */
//     mapRef.current.addLayer({
//       id: "cluster-count",
//       type: "symbol",
//       source: "issues",
//       filter: ["has", "point_count"],
//       layout: {
//         "text-field": "{point_count_abbreviated}",
//         "text-size": 12,
//       },
//       paint: { "text-color": "#ffffff" },
//     })

//     /* individual points */
//     mapRef.current.addLayer({
//       id: "unclustered",
//       type: "circle",
//       source: "issues",
//       filter: ["!", ["has", "point_count"]],
//       paint: {
//         "circle-color": [
//           "match",
//           ["get", "status"],
//           "pending",
//           statusColors.pending.color,
//           "in-progress",
//           statusColors["in-progress"].color,
//           "resolved",
//           statusColors.resolved.color,
//           "#6b7280",
//         ],
//         "circle-radius": [
//           "case",
//           ["==", ["get", "priority"], "high"],
//           12,
//           ["==", ["get", "priority"], "medium"],
//           10,
//           8,
//         ],
//         "circle-stroke-width": 2,
//         "circle-stroke-color": "#fff",
//       },
//     })

//     /* cluster click → zoom */
//     mapRef.current.on("click", "clusters", (e) => {
//       const feature = e.features?.[0]
//       if (!feature) return
//       const clusterId = feature.properties?.cluster_id
//       const source = mapRef.current.getSource("issues")
//       source.getClusterExpansionZoom(clusterId, (err, zoom) => {
//         if (err) return
//         mapRef.current.easeTo({ center: feature.geometry.coordinates, zoom })
//       })
//     })

//     /* point click → select issue */
//     mapRef.current.on("click", "unclustered", (e) => {
//       const feature = e.features?.[0]
//       if (!feature) return
//       const id = feature.properties?.id
//       const hit = issues.find((i) => i.id === id)
//       if (hit) {
//         onIssueSelect(hit)
//         showPopup(hit)
//       }
//     })

//     /* pointer cursor */
//     ;["clusters", "unclustered"].forEach((layer) => {
//       mapRef.current.on("mouseenter", layer, () => {
//         mapRef.current.getCanvas().style.cursor = "pointer"
//       })
//       mapRef.current.on("mouseleave", layer, () => {
//         mapRef.current.getCanvas().style.cursor = ""
//       })
//     })
//   }

//   const featureCollection = (data) => ({
//     type: "FeatureCollection",
//     features: data.map((i) => ({
//       type: "Feature",
//       properties: {
//         id: i.id,
//         title: i.title,
//         status: i.status,
//         priority: i.priority,
//         votes: i.votes,
//       },
//       geometry: { type: "Point", coordinates: i.coordinates },
//     })),
//   })

//   const showPopup = (issue) => {
//     if (!mapRef.current) return
//     popupRef.current?.remove()

//     const StatusIcon = statusIcons[issue.status]
//     const html = `
//       <div style="padding:12px;max-width:240px;">
//         <h3 style="font-weight:600;margin-bottom:4px;">${issue.title}</h3>
//         <p style="font-size:12px;color:#4b5563;margin-bottom:6px;">${issue.description}</p>
//         <p style="font-size:11px;color:#6b7280;">${issue.location}</p>
//       </div>
//     `

//     popupRef.current = new maplibregl.Popup({ closeButton: true })
//       .setLngLat(issue.coordinates)
//       .setHTML(html)
//       .addTo(mapRef.current)
//   }

  
//   useEffect(() => {
//     if (!mapRef.current || !loaded) return
//     const src = mapRef.current.getSource("issues")
//     src.setData(featureCollection(issues))
//   }, [issues, loaded])

 
//   useEffect(() => {
//     if (selectedIssue && mapRef.current) {
//       mapRef.current.flyTo({ center: selectedIssue.coordinates, zoom: 15 })
//       showPopup(selectedIssue)
//     }
//   }, [selectedIssue])

//   return (
//     <div className="relative">
//       <div ref={mapNode} className="h-80 w-full rounded-lg overflow-hidden" />
//       {!loaded && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//           <div className="animate-spin h-8 w-8 border-t-2 border-blue-600 rounded-full" />
//         </div>
//       )}
//     </div>
//   )
// }
