import { useEffect, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';
import { Html, Text } from '@react-three/drei'

// Smoothing function
const lerp = (a, b, t) => ((1 - t) * a + t * b)


export default function Wall({ dim, count, prog, messages, ...props }) {
  
  const scroller = useRef();
  
  useFrame(() => scroller.current.position.x = lerp(scroller.current.position.x, -prog*dim.x, .07));

  return (
    <group {...props} ref={scroller}>

      <Bricks key={`boxes--${count.x}-${count.y}`} {...{ dim, count }}/>
      { messages.map((message) => 
        <Html
          key={message.id}
          position={[message.x, message.y, dim.z/2]}
          transform={true}
          zIndexRange={[1000, 0]}
          style={{
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            width: '100px',
            color: message.color,
            fontSize: '20px',
            lineHeight: 1,
            fontFamily: 'ADrip',
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            <span>{ message.text }</span>
          </div>
        </Html>
        // <Text
        //   // key={index}
        //   // color="white" // default
        //   // anchorX="center" // default
        //   // anchorY="middle" // default
        // >
        //   { message }
        // </Text>
      )}

    </group>
  )
}


const Bricks = ({ dim, count }) => {

  const bricks = useRef(),
        mortar = useRef();
  
  useEffect(() => { // Map instance positions
    const transform = new THREE.Matrix4();

    for (let ix = 0; ix < count.x; ++ix) {
      for (let iy = 0; iy < count.y; ++iy) {
        
        const setAt = ix*count.y + iy, // which brick?
              offMult = iy%2; // multiplier for adjusting odd rows
        
        // Brick
        var x = dim.x * (ix - offMult*0.5),
            y = dim.y * (count.y - iy - 0.5);
        transform.setPosition(x, y, 0)
        bricks.current.setMatrixAt(setAt, transform)
        
        // Mortar
        if (iy == 0) y = y - 2*dim.sp; // clear top edge
        if (ix == 0) x = x + 2*dim.sp + offMult*dim.x/2; // clear left edge
        if (ix == count.x - 1) x = x - 2*dim.sp - (1 - offMult)*dim.x/2; // clear right edge
        transform.setPosition(x, y, 0)
        mortar.current.setMatrixAt(setAt, transform)
      }
    }
  }, []);


  return (
    <>
      <instancedMesh ref={bricks} position={[0, -dim.y*count.y/2, 0]} args={[null, null, count.x*count.y]}>
        <boxBufferGeometry args={[(1 - dim.sp/dim.x)*dim.x, (1 - dim.sp/dim.y)*dim.y, dim.z]} />
          <meshStandardMaterial
            attach="material"
            color='#fc693d'
            roughness={1}
            metalness={0}
          />
      </instancedMesh>
      <instancedMesh ref={mortar} position={[0, -dim.y*count.y/2, 0]} args={[null, null, count.x*count.y]}>
        <boxBufferGeometry args={[(1 + dim.sp/dim.x)*dim.x, (1 + dim.sp/dim.y)*dim.y, (1 - dim.sp/dim.z)*dim.z]} />
          <meshStandardMaterial
            attach="material"
            color='#c7c1bf'
            roughness={1}
            metalness={0}
          />
      </instancedMesh>
    </>
  )
}