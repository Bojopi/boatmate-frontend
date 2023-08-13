
import React, { useState } from 'react';
import { GoogleMap, Autocomplete, Marker } from '@react-google-maps/api';
import { useJsApiLoader } from '@react-google-maps/api';

export type InputProps = {
  readonly?: boolean;
  selectedLocation: any;
  setSelectedLocation: any;
  getAddress: any;
  selectedPlace: string;
  setSelectedPlace: any;
  height?: string;
  setZip?: any;
}

let center = {
  lat: 37.7749,
  lng: -122.4194,
};

let zoom = 15

const libraries: any = ['places'];

const MapComponent: React.FC<InputProps> = ({readonly = false, height='400px', selectedLocation, setSelectedLocation, getAddress, selectedPlace, setSelectedPlace, setZip}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBfwNcp4UHQnucX_gq0_ThusY_ceSgAtyU',
    libraries
  });

  let mapContainerStyle = {
    width: '100%',
    height: height,
  };

  const [autocomplete, setAutocomplete] = useState<any>(null);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando el mapa</div>;

  const onPlaceChanged = () => {
    if (autocomplete != null) {
      const place = autocomplete.getPlace();
      const code = place.address_components.find((data: any) => data.types.includes('postal_code'));
      setZip(code != undefined ? code.long_name : 'No Zip Code');
      setSelectedPlace(place.formatted_address)
      setSelectedLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
      });
      center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
      zoom = 15
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const onSelectMap = async (e: any) => {
    setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });

    try {
      const { data } = await getAddress(e.latLng.lat(), e.latLng.lng());
      const code = data.results[0].address_components.find((data: any) => data.types.includes('postal_code'));
      setZip(code != undefined ? code.long_name : 'No Zip Code');
      setSelectedPlace(data.results[0].formatted_address);
    } catch (error) {
      console.log('Error getting the address');
    }
  }

  return (
    <div className='w-full flex flex-col gap-2'>
      <Autocomplete
        onLoad={autocomplete => setAutocomplete(autocomplete)}
        onPlaceChanged={onPlaceChanged}
      >
        <input type="text" className='p-inputtext w-full text-sm rounded-xl border-neutral-200 read-only:focus:shadow-none' readOnly={readonly} value={selectedPlace} onChange={(e: any) => {setSelectedPlace(e.target.value)}} placeholder="Search for a location" />
      </Autocomplete>
      <div className={readonly ? 'hidden' : 'block'}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={selectedLocation != null ? selectedLocation : center}
          onClick={(e: any) => onSelectMap(e)}
        >
          {selectedLocation ? (
            <Marker
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            />
          ) : null}
        </GoogleMap>
      </div>
    </div>
  );
}

export default MapComponent