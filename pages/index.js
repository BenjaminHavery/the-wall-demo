import { useState, useEffect, useRef } from 'react'
import { nanoid } from 'nanoid'

import { clamp, useTimeout } from '../data/util'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { FaSprayCan, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import Wall from '../components/Wall'

import { brick as b, message as m, colors } from '../data/const'



// Brick meta
const dim = { x: 1, y: 0.25, z: 0.5, sp: 0.025, ms: 3 };
const count = {
  x: 501,
  y: 20,
};
  

export default function WallPage() {

  const [prog, setProg] = useState(0),
        [newMessage, setNewMessage] = useState(''),
        [messages, setMessages] = useState([]);

  useTimeout(() => {
    addMessage('A Ben H demo ~-~<>~-~ benhavery.info ~-~-~-~');
  }, 0)
  useTimeout(() => {
    addMessage('DRAG to LOOK =========== ARROWS or SCROLL to MOVE');
  }, 2500)
  useTimeout(() => {
    addMessage('Would YOU like to WRITE on my WALL?');
  }, 5000);


  const addMessage = (text) => {
    if (!text.length) return;
    const prevX = !!messages.length ? messages[messages.length-1].x : 0;
    const message = {
      id: nanoid(),
      text: text,
      x: prevX + m.dm.x,
      y: (Math.random() - 0.5) * count.y * b.dm.y/3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
    setNewMessage('');
    setMessages([...messages, message]);
    setProg(message.x);
    console.log(messages, prog);
  }
  
  const updateVirtualScroll = (change) => {
    const newProg = clamp(prog + Math.floor(change), 0, count.x - 2);
    if (prog !== newProg) setProg(newProg);
  }

  return (
    <div className='wrapper' onWheel={(e) => updateVirtualScroll(Math.sign(e.deltaY))}>
      <Canvas className='canvas' camera={{ position: [0, 0, count.y*b.dm.y/1.4]}}>
        
        <ambientLight intensity={0.1} />
        <pointLight intensity={0.8} position={[10, 10, 10]} />
        {/* <axesHelper args={[10, 10, 10]} /> */}

        <fog attach="fog" args={['#000000', 1*m.dm.x, 10*m.dm.x]} />
        <Wall
          messages={ messages.filter(mes => prog - 6*m.dm.x < mes.x && prog + 6*m.dm.x > mes.x) }
          {...{ dim, count, prog,  }}
        />

        <OrbitControls
          maxPolarAngle={1.8}
          minPolarAngle={0.2}
          minAzimuthAngle={-1}
          maxAzimuthAngle={1}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>

      <div className='controls'>
        <div className='row'>
          <button
            className='button'
            onClick={() => updateVirtualScroll(-m.dm.x)}
            >
            <FaChevronLeft/>
          </button>
          <button
            className='button'
            onClick={() => updateVirtualScroll(m.dm.x)}
            >
            <FaChevronRight/>
          </button>
        </div>
        <div className='row'>
          <input
            className='input'
            type="text"
            value={newMessage}
            placeholder='Type your message'
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className='button'
            onClick={() => addMessage(newMessage)}
            >
            <FaSprayCan/>
          </button>
        </div>
        
      </div>
      
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
          display: flex;
          flex-flow: row wrap;
          align-items: flex-end;
          z-index: 100000;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          padding-bottom: 60px;
          pointer-events: none;
        }

        .row {
          display: flex;
          flex-flow: row nowrap;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
          padding: 10px;
        }

        .input, .button {
          pointer-events: all;
          opacity: 0.5;
        }
        .input:focus {
          opacity: 1;
        }

        .input {
          display: block;
          flex: 1 1 auto;
          margin: 0 15px 0 0;
          padding: 10px 20px;
          border: none;
          border-radius: 15px;
          outline: none;
          background: white;
          font-size: 16px;
          text-align: right;
        }

        .button {
          display: flex;
          flex-flow: row nowrap;
          align-items: flex-end;
          flex: 0 0 auto;
          margin: 0;
          padding: 0;
          color: white;
          border: none;
          outline: none;
          background: none;
          font-size: 56px;
          cursor: pointer;
        }

        @media screen and (max-width: 1000px) {
          .button:focus {
            opacity: 1;
          }
        }
        @media screen and (min-width: 1000px) {
          .controls {
            padding-bottom: 0;
          }
          .input:hover, .button:hover {
            opacity: 1;
          }
        }
      `}</style>
      
    </div>

  )
}