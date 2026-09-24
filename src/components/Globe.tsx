import { useEffect, useRef, useState } from 'react';
import GlobeGl from 'react-globe.gl';
import * as THREE from 'three';

export default function Globe() {
  const globeRef = useRef<any>(null);
  const [countries, setCountries] = useState<any>({ features: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load lightweight countries GeoJSON for vector landmasses
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Could not load countries GeoJSON", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      // Configure slow continuous rotation via orbit controls
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.55; // One full rotation in ~50s
      controls.enableZoom = false; // Disable zooming to match display map lock
    }
  }, [countries]);

  return (
    <div className="relative w-full h-[360px] flex items-center justify-center overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
          <div className="h-6 w-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
        </div>
      )}
      <div className="h-[360px] w-[360px] flex items-center justify-center select-none pointer-events-auto">
        <GlobeGl
          ref={globeRef}
          width={360}
          height={360}
          backgroundColor="rgba(0,0,0,0)"
          showAtmosphere={true}
          atmosphereColor="#10b981"
          atmosphereAltitude={0.18}
          globeMaterial={new THREE.MeshPhongMaterial({ color: '#071613' })}
          polygonsData={countries.features}
          polygonCapColor={() => 'rgba(16, 185, 129, 0.18)'}
          polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
          polygonStrokeColor={() => 'rgba(16, 185, 129, 0.45)'}
          polygonAltitude={0.015}
        />
      </div>
    </div>
  );
}
