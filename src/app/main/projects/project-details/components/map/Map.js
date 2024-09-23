import { Button } from "@material-ui/core";
import GoogleMap from "google-map-react";
import React, { useState } from "react";
import Constants from "app/main/config/constants";

// function Marker(props) {
//   return (
//     <Tooltip title="mumbai" placement="top">
//       <Icon className="text-red">place</Icon>
//     </Tooltip>
//   );
// }

const Marker = ({ children }) => children;

function Map() {
  const [markers, setMarkers] = useState([
    { lat: 19.07609, lng: 72.877426 },
    { lat: 19.07709, lng: 72.878426 },
    { lat: 19.07659, lng: 72.877526 },
    { lat: 19.076, lng: 72.8776 },
    { lat: 19.07719, lng: 72.878526 },
    { lat: 19.07699, lng: 72.877526 },
    { lat: 19.07799, lng: 72.877426 },
    { lat: 19.07809, lng: 72.876426 },
    { lat: 19.07809, lng: 72.876 },
    { lat: 19.07559, lng: 72.875426 },
  ]);
  return (
    <div style={{ height: "77vh", width: "100%" }}>
      <GoogleMap
        bootstrapURLKeys={{
          key: Constants.MAP_KEY,
        }}
        defaultZoom={15}
        defaultCenter={[19.07609, 72.877426]}
        // options={{
        //   styles: props.data.styles,
        // }}
      >
        {markers.map((marker) => (
          <Marker key="mumbai" text="mumbai" lat={marker.lat} lng={marker.lng}>
            <Button style={{ background: "none", border: "none" }}>
              <img
                src="assets/images/logos/construction_worker.png"
                width={30}
                height={30}
              />
            </Button>
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
}

export default Map;
