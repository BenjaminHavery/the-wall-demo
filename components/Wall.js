import { useState, useEffect, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import * as THREE from 'three';

// Smoothing function
const lerp = (a, b, t) => ((1 - t) * a + t * b)

// Brick proportions
const dim = { x: 4, y: 1, z: 2 };


export default function Wall({ count, prog, ...props }) {
  
  const scroller = useRef();
  
  useFrame(() => scroller.current.position.x = lerp(scroller.current.position.x, -prog*dim.x, .07));

  return (
    <group {...props} ref={scroller}>

      <Bricks key={`boxes--${count.x}-${count.y}`} {...{ count }}/>

    </group>
  )
}


const Bricks = ({ count }) => {

  const bricks = useRef(),
        mortar = useRef();
  
  useEffect(() => { // Map instance positions
    const transform = new THREE.Matrix4();

    for (let ix = 0; ix < count.x; ++ix) {
      for (let iy = 0; iy < count.y; ++iy) {
        
        const setAt = ix*count.y + iy,
              offMult = iy%2;
        
        var x = dim.x * (ix - offMult*0.5),
            y = dim.y * count.y - iy - 1;
        
        transform.setPosition(x, y, 0)
        bricks.current.setMatrixAt(setAt, transform)
        
        if (iy == 0) y = y - 0.2;
        if (ix == 0) x = x + 0.2 + offMult * dim.x/2;
        if (ix == count.x - 1) x = x - 0.2 - (1 - offMult) * dim.x/2;
        
        transform.setPosition(x, y, 0)
        mortar.current.setMatrixAt(setAt, transform)
      }
    }
  }, []);


  return (
    <>
      <instancedMesh ref={bricks} position={[0, -dim.y*count.y/2, 0]} args={[null, null, count.x*count.y]}>
        <boxBufferGeometry args={[0.975*dim.x, 0.9*dim.y, dim.z]} />
          <meshStandardMaterial
            attach="material"
            color='#fc693d'
          />
      </instancedMesh>
      <instancedMesh ref={mortar} position={[0, -dim.y*count.y/2, 0]} args={[null, null, count.x*count.y]}>
        <boxBufferGeometry args={[1.025*dim.x, 1.1*dim.y, 0.9*dim.z]} />
          <meshStandardMaterial
            attach="material"
            color='#c7c1bf'
          />
      </instancedMesh>
    </>
  )
}