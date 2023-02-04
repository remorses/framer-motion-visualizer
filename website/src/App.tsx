import { useEffect, useRef, useState } from 'react'
import { RangeSlider } from 'beskar/src/landing/form'

import logo from './logo.svg'
import './index.css'
import classNames from 'classnames'
import {
    motion,
    useMotionValue,
    useAnimationControls,
    Spring,
    animate,
} from 'framer-motion'
import React from 'react'

function App() {
    const [state, setState] = useState<Partial<Spring>>({
        stiffness: 100,
        damping: 10,
        mass: 1,
        // duration: 0.8,
        bounce: 0,
        restSpeed: 0.01,
        restDelta: 0.01,
    })

    let x = useMotionValue(0)

    const config = {
        stiffness: {
            min: 0,
            max: 1000,
            step: 1,
        },
        damping: {
            min: 0,
            max: 100,
            step: 1,
        },
        mass: {
            min: 1,
            max: 100,
            step: 1,
        },
        // duration: {
        //     min: 0,
        //     max: 10,
        //     step: 0.1,
        // },
        bounce: {
            min: 0,
            max: 10,
            step: 0.01,
        },
        restSpeed: {
            min: 0,
            max: 10,
            step: 0.1,
        },
        restDelta: {
            min: 0,
            max: 10,
            step: 0.1,
        },
    } as const

    const [count, setCount] = useState(0)

    useEffect(() => {
        let animations = []
        let c = animate(x, 500, {
            type: 'spring',

            onComplete: () => {
                console.log('complete')
                let c = animate(x, 0, {
                    type: 'spring',
                    ...state,
                    onComplete() {
                        setCount(count + 1)
                    },
                })
                animations.push(c)
            },
            ...state,
        })
        animations.push(c)
        return () => {
            animations.forEach((a) => a.stop())
        }
    }, [state, count])
    const container = useRef(null)
    return (
        <div className='flex flex-col w-full items-center m-12'>
            <pre className=''>{JSON.stringify(state, null, 4)}</pre>
            <div className='flex  max-w-[1200px] gap-12'>
                <div
                    ref={container}
                    className='bg-gray-100 p-[10px] items-start justify-center h-full flex rounded flex-col min-h-[400px] w-[600px]'
                >
                    <motion.div
                        drag
                        dragConstraints={container}
                        // animate={controls}
                        style={{ x }}
                        // animate={{
                        //     x: 500,
                        //     transition: { ...state },
                        // }}
                        // transition={{ ...state }}
                        // animate={{
                        //     x: 500,
                        // }}
                        // transition={{
                        //     ...state,
                        //     repeat: Infinity,
                        //     repeatType: 'reverse',
                        // }}
                        className='rounded-full w-[100px] h-[100px] bg-black'
                    ></motion.div>
                </div>
                <div className='flex flex-col gap-6'>
                    {Object.keys(config).map((key) => {
                        let conf = config[key as keyof typeof config]
                        let value = state[key as keyof typeof state] || 0
                        return (
                            <div className='text-sm'>
                                <div className='flex'>
                                    <div className='capitalize'>{key}</div>
                                    <div className='grow'></div>
                                    <div className='text-xs font-mono'>
                                        {value}
                                    </div>
                                </div>
                                <RangeSlider
                                    value={value}
                                    className='text-sm'
                                    onChange={(e) => {
                                        x.stop()
                                        x.jump(0)
                                        setState((prev) => {
                                            return {
                                                ...prev,
                                                [key]: Number(e.target.value),
                                            }
                                        })
                                    }}
                                    step={conf.step}
                                    min={conf.min}
                                    max={conf.max}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default App

export function useDebouncedEffect(callback, deps = [], delay = 120) {
    const data = React.useRef({
        firstTime: true,
        clearFunc: null as Function | null,
    })
    React.useEffect(() => {
        const { firstTime, clearFunc } = data.current

        if (firstTime) {
            data.current.firstTime = false
            return
        }

        const handler = setTimeout(() => {
            if (clearFunc && typeof clearFunc === 'function') {
                clearFunc()
            }
            data.current.clearFunc = callback()
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [delay, ...deps])
}
