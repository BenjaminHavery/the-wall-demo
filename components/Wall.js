
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';
import { clamp, lerp } from '../data/util'

import { Html, Text } from '@react-three/drei'
import { brick as b, message as m } from '../data/const'


export default function Wall({ count, prog, messages, ...props }) {
  
  const scroller = useRef();
  
  useFrame(() => scroller.current.position.x = lerp(scroller.current.position.x, -prog*b.dm.x, .07));

  return (
    <group {...props} ref={scroller}>

      <Bricks key={`boxes--${b.no.x}-${b.no.y}`} {...{ count }}/>
      
      { messages.map((mes) => 
        <Html
          key={mes.id}
          position={[mes.x, mes.y, b.dm.z/2]}
          transform={true}
          zIndexRange={[1000, 0]}
          style={{
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <div
            className='tag'
            style={{
              color: mes.color,
              opacity: clamp(2 * (1 - Math.abs(mes.x - prog)/(6*m.dm.x)) ** 1.5, 0, 1),
            }}
          >
            <span>{ mes.text }</span>
            
            <style jsx>{`
              
              .tag {
                width: ${m.htdm.x}px;
                font-size: ${m.htdm.font}px;
                line-height: 1;
                font-family: 'ADrip';
                text-align: center;
                font-style: italic;
                transition: opacity 0.1s linear;
              }
            `}</style>
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


const Bricks = () => {

  const bricks = useRef(),
        mortar = useRef();
  
  useEffect(() => { // Map instance positions
    const transform = new THREE.Matrix4();

    for (let ix = 0; ix < b.no.x; ++ix) {
      for (let iy = 0; iy < b.no.y; ++iy) {
        
        const setAt = ix*b.no.y + iy, // which brick?
              offMult = iy%2; // multiplier for adjusting odd rows
        
        // Brick
        var x = b.dm.x * (ix - offMult*0.5),
            y = b.dm.y * (b.no.y - iy - 0.5);
        transform.setPosition(x, y, 0)
        bricks.current.setMatrixAt(setAt, transform)
        
        // Mortar
        if (iy == 0) y = y - 2*b.sp.x; // clear top edge
        if (ix == 0) x = x + 2*b.sp.x + offMult*b.dm.x/2; // clear left edge
        if (ix == b.no.x - 1) x = x - 2*b.sp.x - (1 - offMult)*b.dm.x/2; // clear right edge
        transform.setPosition(x, y, 0)
        mortar.current.setMatrixAt(setAt, transform)
      }
    }
  }, []);


  return (
    <>
      <instancedMesh ref={bricks} position={[0, -b.dm.y*b.no.y/2, 0]} args={[null, null, b.no.x*b.no.y]}>
        <boxBufferGeometry args={[(1 - b.sp.x/b.dm.x)*b.dm.x, (1 - b.sp.x/b.dm.y)*b.dm.y, b.dm.z]} />
          <meshStandardMaterial
            attach="material"
            color='#fc693d'
            roughness={1}
            metalness={0}
          />
      </instancedMesh>
      <instancedMesh ref={mortar} position={[0, -b.dm.y*b.no.y/2, 0]} args={[null, null, b.no.x*b.no.y]}>
        <boxBufferGeometry args={[(1 + b.sp.x/b.dm.x)*b.dm.x, (1 + b.sp.x/b.dm.y)*b.dm.y, (1 - b.sp.x/b.dm.z)*b.dm.z]} />
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