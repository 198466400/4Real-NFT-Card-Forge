import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Character3D } from '../../types';

// Custom material for advanced skin shading
class SkinMaterial extends THREE.MeshStandardMaterial {
  constructor() {
    super({
      color: '#ffccaa',
      roughness: 0.3,
      metallic: 0,
      skinning: true
    });
  }
}

// Extend R3F with custom material
extend({ SkinMaterial });

// Character model component
interface CharacterModelProps {
  character: Character3D;
  animation?: string;
}

const CharacterModel: React.FC<CharacterModelProps> = ({ character, animation }) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/models/character_base.glb') as any;

  // Apply character configuration to the model
  useEffect(() => {
    if (!group.current) return;

    // Apply scale
    group.current.scale.set(
      character.base.scale.x,
      character.base.scale.y,
      character.base.scale.z
    );

    // Apply rotation
    group.current.rotation.set(
      character.base.rotation.x * (Math.PI / 180),
      character.base.rotation.y * (Math.PI / 180),
      character.base.rotation.z * (Math.PI / 180)
    );

    // Apply position
    group.current.position.set(
      character.base.position.x,
      character.base.position.y,
      character.base.position.z
    );
  }, [character.base]);

  // Update materials based on character config
  useEffect(() => {
    if (!materials) return;

    // Update skin material
    if (materials.Skin) {
      materials.Skin.color.set(character.body.skin.color);
      materials.Skin.roughness = character.body.skin.roughness;
      materials.Skin.metalness = character.body.skin.metallic;
    }

    // Update hair material
    if (materials.Hair) {
      materials.Hair.color.set(character.hair.color);
      materials.Hair.roughness = 0.5;
      materials.Hair.metalness = 0;
    }

    // Update outfit materials
    if (materials.Outfit) {
      materials.Outfit.color.set(character.outfit.base.color);
      materials.Outfit.roughness = 0.4;
      materials.Outfit.metalness = 0;
    }
  }, [character, materials]);

  // Animation frame updates
  useFrame(({ clock }) => {
    if (!group.current) return;

    // Apply expressions
    const mouth = group.current.getObjectByName('Mouth');
    if (mouth && character.expression === 'happy') {
      mouth.rotation.x = Math.sin(clock.elapsedTime * 2) * 0.1;
    }

    // Apply eye movement
    const leftEye = group.current.getObjectByName('Eye_Left');
    const rightEye = group.current.getObjectByName('Eye_Right');
    if (leftEye && rightEye) {
      leftEye.rotation.y = Math.sin(clock.elapsedTime) * 0.1;
      rightEye.rotation.y = Math.sin(clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <primitive object={nodes.Hips} />
        <skinnedMesh
          geometry={nodes.Head.geometry}
          material={materials.Skin}
        />
        <skinnedMesh
          geometry={nodes.Hair.geometry}
          material={materials.Hair}
        />
        <skinnedMesh
          geometry={nodes.Body.geometry}
          material={materials.Skin}
        />
        <skinnedMesh
          geometry={nodes.Outfit.geometry}
          material={materials.Outfit}
        />
      </group>
    </group>
  );
};

// Fallback model for when GLTF fails to load
const FallbackCharacter: React.FC<{ character: Character3D }> = ({ character }) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={character.body.skin.color} roughness={0.3} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.8, 32]} />
        <meshStandardMaterial color={character.outfit.base.color} roughness={0.4} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.3, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 32]} />
        <meshStandardMaterial color={character.outfit.base.color} roughness={0.4} />
      </mesh>
      <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 32]} />
        <meshStandardMaterial color={character.outfit.base.color} roughness={0.4} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, -0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.6, 32]} />
        <meshStandardMaterial color={character.outfit.base.color} roughness={0.4} />
      </mesh>
      <mesh position={[0.1, -0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.6, 32]} />
        <meshStandardMaterial color={character.outfit.base.color} roughness={0.4} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={character.hair.color} roughness={0.5} />
      </mesh>
    </mesh>
  );
};

// Lighting setup
const SceneLighting: React.FC<{ lighting: Character3D['lighting'] }> = ({ lighting }) => {
  return (
    <>
      {/* Ambient light */}
      <ambientLight 
        intensity={lighting.ambient.intensity} 
        color={lighting.ambient.color}
      />
      
      {/* Directional lights */}
      {lighting.directional.map((light, index) => (
        <directionalLight
          key={`dir-${index}`}
          position={[light.position?.x || 5, light.position?.y || 5, light.position?.z || 5]}
          intensity={light.intensity}
          color={light.color}
          castShadow={light.castShadow}
        />
      ))}
      
      {/* Point lights */}
      {lighting.point.map((light, index) => (
        <pointLight
          key={`point-${index}`}
          position={[light.position?.x || 0, light.position?.y || 0, light.position?.z || 0]}
          intensity={light.intensity}
          color={light.color}
          distance={light.distance}
          decay={light.decay}
        />
      ))}
      
      {/* Spot lights */}
      {lighting.spot.map((light, index) => (
        <spotLight
          key={`spot-${index}`}
          position={[light.position?.x || 0, light.position?.y || 0, light.position?.z || 0]}
          intensity={light.intensity}
          color={light.color}
          distance={light.distance}
          angle={light.angle}
          penumbra={light.penumbra}
          decay={light.decay}
        />
      ))}
    </>
  );
};

// Camera setup
const SceneCamera: React.FC = () => {
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.position.set(0, 1.5, 3);
    camera.lookAt(0, 1, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return (
    <PerspectiveCamera 
      makeDefault 
      position={[0, 1.5, 3]} 
      fov={50} 
      near={0.1} 
      far={1000}
    />
  );
};

// Main Character Canvas component
export interface CharacterCanvasProps {
  character: Character3D;
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
  showGrid?: boolean;
  background?: string | THREE.Color | THREE.Texture;
  environment?: string;
}

export const CharacterCanvas: React.FC<CharacterCanvasProps> = ({
  character,
  className = '',
  style = { width: '100%', height: '100%' },
  showControls = true,
  showGrid = false,
  background = '#000000',
  environment = 'city'
}) => {
  const [modelError, setModelError] = useState(false);

  // Preload character model
  useEffect(() => {
    // Try to preload the model
    const timer = setTimeout(() => {
      // If model doesn't load in 1 second, show fallback
      setModelError(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`character-canvas-wrapper ${className}`} style={style}>
      <Canvas
        shadows={character.lighting.shadows}
        camera={{ position: [0, 1.5, 3], fov: 50, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: typeof background === 'string' ? background : 'transparent' }}
      >
        {/* Lighting */}
        <SceneLighting lighting={character.lighting} />
        
        {/* Camera */}
        <SceneCamera />
        
        {/* Environment */}
        <Environment preset={environment as any} />
        
        {/* Grid helper */}
        {showGrid && <gridHelper args={[10, 10]} />}
        
        {/* Axes helper */}
        {showGrid && <axesHelper args={[5]} />}
        
        {/* Contact shadows */}
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
        
        {/* Character model */}
        {!modelError ? (
          <Suspense fallback={null}>
            <CharacterModel character={character} />
          </Suspense>
        ) : (
          <FallbackCharacter character={character} />
        )}
        
        {/* Orbit controls */}
        {showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={10}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
          />
        )}
      </Canvas>
      
      {modelError && (
        <div className="canvas-error">
          3D model failed to load. Using fallback representation.
        </div>
      )}
    </div>
  );
};

// Suspense fallback component
const Suspense: React.FC<{ fallback: React.ReactNode; children: React.ReactNode }> = ({
  fallback,
  children
}) => {
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
};

export default CharacterCanvas;
