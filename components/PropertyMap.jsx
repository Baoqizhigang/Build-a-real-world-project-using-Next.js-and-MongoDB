"use client";
import { setDefaults, fromAddress } from "react-geocode";
import { useEffect, useState } from "react";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewport, setViewport] = useState({
    latitudeL: 0,
    longtitude: 0,
    zoom: 12,
    width: "100%",
  });

  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    language: "en",
    region: "us",
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        // Chcek geocode results
        if (res.results.length === 0) {
          setGeocodeError(true);
          return;
        }

        const { lat, lng } = res.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, []);

  if (loading) return <h3>Loading...</h3>;

  if (geocodeError)
    return <div className="text-xl">No location data found</div>;

  return <div>Map</div>;
};

export default PropertyMap;
