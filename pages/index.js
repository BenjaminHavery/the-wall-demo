import { useState, useEffect, useRef } from 'react'
import { nanoid } from 'nanoid'

const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);


import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { FaSprayCan, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import Wall from '../components/Wall'


const colors = [
  '#e8bd42',
  '#40b3ed',
  '#40ed88',
  '#ff91eb',
  '#f5f5f5',
  '#546bff',
  '#383838',
];



export default function WallPage() {

  const [prog, setProg] = useState(0),
        [newMessage, setNewMessage] = useState(''),
        [messages, setMessages] = useState([]);


  useTimeout(() => {
    addMessage('Did you come here to WRITE on my WALL? :)');
  }, 2000);
  useTimeout(() => {
    addMessage('DRAG to LOOK =========== ARROWS or SCROLL to MOVE');
  }, 5000)

  // Brick meta
  const dim = { x: 4, y: 1, z: 2 };
  const count = {
    x: 501,
    y: 20,
  };

  const addMessage = (text) => {
    if (!text.length) return;
    const message = {
      id: nanoid(),
      text: text,
      x: 3 * (messages.length+0.5) * dim.x,
      y: (Math.random() - 0.5) * count.y * dim.y/2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }
    setNewMessage('');
    setMessages([...messages, message]);
    setProg(message.x/dim.x);
    console.log(messages, prog);
  }
  
  const updateVirtualScroll = (change) => {
    const newProg = clamp(prog + Math.floor(change), 0, count.x - 2);
    if (prog !== newProg) setProg(newProg);
  }

  return (
    <div className='wrapper' onWheel={(e) => updateVirtualScroll(e.deltaY/100)}>
      <Canvas className='canvas' camera={{ position: [0, 0, 15]}}>
        
        <ambientLight intensity={0.1} />
        <pointLight intensity={0.8} position={[10, 10, 10]} />
        <axesHelper args={[10, 10, 10]} />

        <fog attach="fog" args={['#000000', 10, 200]} />
        <Wall
          messages={ messages.filter(m => prog*dim.x - 70 < m.x && prog*dim.x + 70 > m.x) }
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
            onClick={() => updateVirtualScroll(-2)}
            >
            <FaChevronLeft/>
          </button>
          <button
            className='button'
            onClick={() => updateVirtualScroll(2)}
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
      `}</style>
      
    </div>

  )
}