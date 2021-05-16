import { useState } from 'react'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import Wall from '../components/Wall'

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);



export default function WallPage() {

  const [prog, setProg] = useState(0);

  const count = {
    x: 101,
    y: 20,
  };

  const updateVirtualScroll = (e) => {
    const newProg = clamp(prog + Math.floor(e.deltaY/100), 0, count.x - 2);
    if (prog !== newProg) setProg(newProg);
  }

  return (
    <div className='wrapper' onWheel={(e) => updateVirtualScroll(e)}>
      <Canvas className='canvas' camera={{ position: [0, 0, 15]}}>
        
        <ambientLight intensity={0.1} />
        <pointLight intensity={0.8} position={[10, 10, 10]} />
        <axesHelper args={[10, 10, 10]} />

        <fog attach="fog" args={['#000000', 10, 200]} />
        <Wall {...{ count, prog }}/>

        <OrbitControls
          maxPolarAngle={1.8}
          minPolarAngle={0.2}
          minAzimuthAngle={-1}
          maxAzimuthAngle={1}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>

      {/* <div className='controls'>
        <button onClick={() => setProg(prog - 1)}>back</button>
        <button onClick={() => setProg(prog + 1)}>forward</button>
      </div> */}
      
      <style jsx>{`
        .wrapper {
          position: relative;
          background: black;
          height: 100vh;
        }
        :global(.canvas) {
          height: 100vh;
          width: 100%;
        }

        .controls {
          position: absolute;
          bottom: 0;
          right: 0;
          background: black;
        }
      `}</style>
      
    </div>

  )
}