import React, { useState, useRef, useEffect } from 'react';
import { Pannellum } from 'pannellum-react';

interface Hotspot {
  id: string;
  pitch: number;
  yaw: number;
  type: 'info' | 'scene';
  text?: string;
  sceneId?: string;
}

interface Scene {
  id: string;
  title: string;
  imageUrl: string;
  hotSpots: Hotspot[];
}

interface VirtualTourProps {
  propertyId: string;
}

export const VirtualTour: React.FC<VirtualTourProps> = ({ propertyId }) => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    fetchTourData();
  }, [propertyId]);

  const fetchTourData = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/virtual-tour`);
      if (!response.ok) throw new Error('Failed to load virtual tour');
      const data = await response.json();
      setScenes(data.scenes);
      setCurrentScene(data.scenes[0]);
    } catch (error) {
      console.error('Error loading virtual tour:', error);
      setError('Failed to load virtual tour');
    } finally {
      setLoading(false);
    }
  };

  const handleSceneChange = (sceneId: string) => {
    const newScene = scenes.find(scene => scene.id === sceneId);
    if (newScene) {
      setCurrentScene(newScene);
    }
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.type === 'scene' && hotspot.sceneId) {
      handleSceneChange(hotspot.sceneId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[500px] bg-red-50 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Tour Navigation */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleSceneChange(scene.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                currentScene?.id === scene.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {scene.title}
            </button>
          ))}
        </div>
      </div>

      {/* 360° Viewer */}
      {currentScene && (
        <div className="relative h-[500px]">
          <Pannellum
            ref={viewerRef}
            width="100%"
            height="100%"
            image={currentScene.imageUrl}
            pitch={10}
            yaw={180}
            hfov={110}
            autoLoad
            onLoad={() => {
              console.log('Panorama loaded');
            }}
            hotspots={currentScene.hotSpots.map(hotspot => ({
              ...hotspot,
              handleClick: () => handleHotspotClick(hotspot),
              handleClickArg: hotspot
            }))}
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-2 space-x-2">
            <button
              onClick={() => viewerRef.current?.zoomIn()}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={() => viewerRef.current?.zoomOut()}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={() => viewerRef.current?.loadScene(currentScene.id)}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Scene Information */}
      {currentScene && (
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">
            {currentScene.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Click and drag to look around. Use the scroll wheel or buttons to zoom.
          </p>
        </div>
      )}
    </div>
  );
}; 