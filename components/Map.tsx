import { useState, useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

export default function Places() {
  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  //   // libraries: ["places"],
  // });

  // if (!isLoaded) return <div>Loading...</div>;

  console.log("AIzaSyCLvI-EFyxBJoULpL3qS6ixXYPjRNlATSs");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCLvI-EFyxBJoULpL3qS6ixXYPjRNlATSs"!,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="places-container" onClick={() => console.log("hello")}>
        <PlacesAutocomplete setSelected={setSelected} />
      </div>

      <div style={{ height: "400px", width: "100%" }}>
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
        >
          {<Marker position={selected} />}
        </GoogleMap>
      </div>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search an address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
