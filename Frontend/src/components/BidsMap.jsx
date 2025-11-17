import { useMemo } from "react";
import { Button } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// provider icon
const providerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// user icon (distinct)
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export default function BidsMap({
  bids = [],
  userLocation = null,
  handleSelectBid,
}) {
  // filter bids that have valid location
  const validBids = useMemo(
    () => bids.filter((b) => b?.location?.lat && b?.location?.lng),
    [bids]
  );

  // determine center: userLocation > first provider > India center fallback
  const center = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (validBids.length > 0)
      return [validBids[0].location.lat, validBids[0].location.lng];
    return [20.5937, 78.9629]; // India center fallback
  }, [userLocation, validBids]);

  // default zoom
  const zoom = userLocation ? 13 : validBids.length > 0 ? 12 : 5;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Provider markers */}
      {validBids.map((bid, idx) => (
        <Marker
          key={bid._id || idx}
          position={[bid.location.lat, bid.location.lng]}
          icon={providerIcon}
        >
          <Popup>
            <div>
              <strong>{bid.providerId?.name || "Provider"}</strong>
              <br />
              Cost: ₹{bid.proposedCost}
              <br />⭐ {bid.providerId?.averageRating || 0}
              {bid.status && (
                <>
                  <br />
                  <em>Status: {bid.status}</em>
                </>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSelectBid(task._id, bid._id)}
              >
                Select Provider
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* User marker + small accuracy circle */}
      {userLocation && (
        <>
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>
              <div>
                <strong>You are here</strong>
              </div>
            </Popup>
          </Marker>

          {/* optional small circle to show area (50m) */}
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={50}
            pathOptions={{ color: "#1976d2", fillOpacity: 0.15 }}
          />
        </>
      )}
    </MapContainer>
  );
}
