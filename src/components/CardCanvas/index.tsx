import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { NFTCard, Character3D, CardTemplate, CardLayer, BackgroundConfig, EffectType } from '../../types';

export interface CardCanvasProps {
  card: NFTCard;
  character?: Character3D;
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
  showGrid?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  onRenderComplete?: (image: string) => void;
}

// Background component
const CardBackground: React.FC<{ config: BackgroundConfig }> = ({ config }) => {
  switch (config.type) {
    case 'solid':
      return <color attach="background" args={[config.color || '#000000']} />;
    
    case 'gradient':
      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial
            side={THREE.DoubleSide}
            color="white"
          />
          {/* Gradient overlay */}
          <Html center>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(${config.direction || '135deg'}, ${config.colors?.join(', ') || '#6366f1, #8b5cf6'})`,
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
          </Html>
        </mesh>
      );
    
    case 'image':
      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial
            side={THREE.DoubleSide}
          >
            {config.image && (
              <primitive object={new THREE.TextureLoader().load(config.image)} />
            )}
          </meshBasicMaterial>
        </mesh>
      );
    
    case 'pattern':
      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial
            side={THREE.DoubleSide}
            color={config.color || '#000000'}
          />
        </mesh>
      );
    
    default:
      return <color attach="background" args={[config.color || '#000000']} />;
  }
};

// Layer renderer
const LayerRenderer: React.FC<{ layer: CardLayer; index: number; card: NFTCard }> = ({ layer, index, card }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree();

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    // Apply animations if any
    if (layer.style?.animation) {
      mesh.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.1;
    }
  });

  if (!layer.visible) return null;

  switch (layer.type) {
    case 'image':
      return (
        <mesh
          ref={mesh}
          position={[
            layer.position.x / 100,
            layer.position.y / 100,
            index * 0.01
          ]}
          rotation={[0, 0, layer.rotation || 0]}
        >
          <planeGeometry
            args={[
              layer.size.width / 100,
              layer.size.height / 100
            ]}
          />
          <meshBasicMaterial
            side={THREE.DoubleSide}
            transparent
            opacity={layer.opacity ?? 1}
          >
            {layer.content && typeof layer.content === 'string' && (
              <primitive 
                object={new THREE.TextureLoader().load(layer.content)} 
                attach="map"
              />
            )}
          </meshBasicMaterial>
        </mesh>
      );
    
    case 'text':
      return (
        <Html
          position={[
            layer.position.x / 100,
            layer.position.y / 100,
            index * 0.01
          ]}
          rotation={[0, 0, layer.rotation || 0]}
          transform
          occlude
          sprite
        >
          <div
            style={{
              color: layer.style?.color || '#ffffff',
              fontFamily: layer.style?.fontFamily || 'Inter',
              fontSize: layer.style?.fontSize || 16,
              fontWeight: layer.style?.fontWeight || 400,
              textAlign: layer.style?.textAlign || 'center',
              width: layer.size.width,
              height: layer.size.height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: layer.opacity ?? 1,
              background: layer.style?.background || 'transparent'
            }}
          >
            {layer.content}
          </div>
        </Html>
      );
    
    case 'shape':
      return (
        <mesh
          ref={mesh}
          position={[
            layer.position.x / 100,
            layer.position.y / 100,
            index * 0.01
          ]}
          rotation={[0, 0, layer.rotation || 0]}
        >
          <boxGeometry args={[layer.size.width / 100, layer.size.height / 100, 0.01]} />
          <meshStandardMaterial
            color={layer.style?.color || '#ffffff'}
            transparent
            opacity={layer.opacity ?? 1}
          />
        </mesh>
      );
    
    case 'character':
      return (
        <group
          position={[
            layer.position.x / 100,
            layer.position.y / 100,
            index * 0.01
          ]}
          rotation={[0, 0, layer.rotation || 0]}
          scale={[0.5, 0.5, 0.5]}
        >
          {/* Character would be rendered here */}
          <mesh>
            <boxGeometry args={[0.5, 0.8, 0.5]} />
            <meshStandardMaterial color="#ff6b6b" />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="#ffccaa" />
          </mesh>
        </group>
      );
    
    default:
      return null;
  }
};

// Effect renderer
const EffectRenderer: React.FC<{ effect: EffectType; config: any }> = ({ effect, config }) => {
  switch (effect) {
    case 'glow':
      return (
        <pointLight
          position={[0, 0, 5]}
          color={config.color || '#6366f1'}
          intensity={config.intensity || 2}
          distance={config.outerRadius || 10}
        />
      );
    
    case 'shadow':
      return (
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
      );
    
    case 'blur':
    case 'sharpen':
    case 'noise':
    case 'vignette':
    case 'chromatic_aberration':
    case 'distortion':
    case 'particles':
    case 'animation':
    case 'holographic':
    case 'neon':
    case 'gradient_overlay':
      // These effects would be applied in post-processing
      return null;
    
    default:
      return null;
  }
};

// Card frame component
const CardFrame: React.FC<{ template: CardTemplate }> = ({ template }) => {
  return (
    <group>
      {/* Frame background */}
      <mesh
        position={[0, 0, -0.1]}
        rotation={[0, 0, 0]}
      >
        <planeGeometry
          args={[
            template.dimensions.width / 100 + 0.2,
            template.dimensions.height / 100 + 0.2
          ]}
        />
        <meshStandardMaterial
          color={template.border.color || '#6366f1'}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Main Card Canvas component
export const CardCanvas: React.FC<CardCanvasProps> = ({
  card,
  character,
  className = '',
  style = { width: '100%', height: '100%' },
  showControls = true,
  showGrid = false,
  quality = 'high',
  onRenderComplete
}) => {
  const [isReady, setIsReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate quality settings
  const getQualitySettings = () => {
    switch (quality) {
      case 'low':
        return { samples: 1, resolution: 512 };
      case 'medium':
        return { samples: 2, resolution: 1024 };
      case 'high':
        return { samples: 4, resolution: 2048 };
      case 'ultra':
        return { samples: 8, resolution: 4096 };
      default:
        return { samples: 4, resolution: 2048 };
    }
  };

  const handleRender = useCallback(() => {
    if (!canvasRef.current || !onRenderComplete) return;
    
    // This would capture the canvas and convert to image
    // For now, we'll just call the callback with a placeholder
    // In production, this would use html2canvas or similar
  }, [onRenderComplete]);

  return (
    <div className={`card-canvas-wrapper ${className}`} style={style}>
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        onCreated={({ gl }) => {
          gl.setSize(style.width as number, style.height as number);
          setIsReady(true);
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} castShadow />
        <pointLight position={[0, 0, 5]} intensity={0.5} />
        
        {/* Camera */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 5]} 
          fov={50} 
          near={0.1} 
          far={1000}
        />
        
        {/* Background */}
        <CardBackground config={card.template.background} />
        
        {/* Card frame */}
        <CardFrame template={card.template} />
        
        {/* Layers */}
        {card.template.layers.map((layer, index) => (
          <LayerRenderer 
            key={layer.id || index} 
            layer={layer} 
            index={index} 
            card={card}
          />
        ))}
        
        {/* Effects */}
        {card.effects.map((effect, index) => (
          <EffectRenderer 
            key={effect.id || index} 
            effect={effect.type} 
            config={effect.config}
          />
        ))}
        
        {/* Character if available */}
        {character && (
          <group position={[0, 0, 0.5]} scale={[0.5, 0.5, 0.5]}>
            {/* Character placeholder - in production this would use the CharacterCanvas */}
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color="#ffccaa" />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.3, 0.6, 0.2]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
          </group>
        )}
        
        {/* Orbit controls */}
        {showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={20}
          />
        )}
        
        {/* Grid helper */}
        {showGrid && <gridHelper args={[10, 10]} />}
      </Canvas>
      
      {!isReady && (
        <div className="canvas-loading">
          <div className="loading-spinner" />
          <p>Rendering card...</p>
        </div>
      )}
    </div>
  );
};

export default CardCanvas;
