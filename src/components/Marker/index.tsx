import React from 'react';

import './styles.css';

interface MarkerProps {
  lat: number;
  lng: number;
  name: string;
  color: string;
  id: string;
}

const Marker: React.FC<MarkerProps> = (props: MarkerProps) => {
  const { color, name, id } = props;

  return (
    <div
      key={id}
      className="pin bounce"
      style={{ backgroundColor: color, cursor: 'pointer' }}
      title={name}
    />
  );
};

export default Marker;
