import { useEffect, useRef, useState } from 'react'
import '@tremor/react/dist/esm/tremor.css'
import {
    Card,
    Title,
    Text,
    LineChart,
    Toggle,
    ToggleItem,
    Flex,
    Block,
} from '@tremor/react'

import { BadgeSelect } from 'beskar/src/analytics/components/badge-select'
import { Button, RangeSlider } from 'beskar/src/landing/form'

import logo from './logo.svg'
import './index.css'
import classNames from 'classnames'
import {
    motion,
    useMotionValue,
    useAnimationControls,
    Spring,
    animate,
    spring,
} from 'framer-motion'
import React from 'react'

function App() {
    const [mode, setMode] = useState<'duration' | 'mass'>('duration')

    const initialState = (mode) =>
        mode === 'duration'
            ? { duration: 1, bounce: 0 }
            : { mass: 1, damping: 10, stiffness: 100 }
    const [state, setState] = useState<Partial<Spring>>(initialState(mode))

    let playbackRate = useMotionValue(1)
    let x = useMotionValue(0)

    const config =
        mode === 'duration'
            ? {
                  duration: {
                      min: 0,
                      max: 10,
                      step: 0.1,
                  },
                  bounce: {
                      min: 0,
                      max: 1,
                      step: 0.01,
                  },
                  // restSpeed: {
                  //     min: 0,
                  //     max: 10,
                  //     step: 0.1,
                  // },
                  // restDelta: {
                  //     min: 0,
                  //     max: 10,
                  //     step: 0.1,
                  // },
              }
            : ({
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
              } as const)

    // const [count, setCount] = useState(0)

    const [loaded, setLoaded] = useState(false)
    let lastValue = 500
    useDebouncedEffect(() => {
        let animations = []
        x.jump(0)
        let c = animate(x, lastValue, {
            type: 'spring',
            ...state,
        })
        animations.push(c)
        return () => {
            animations.forEach((a) => a.stop())
        }
    }, [loaded, state])
    let [chartData, setChartData] = useState([])
    useDebouncedEffect(() => {
        let from = 0

        let duration = state.duration ? state.duration * 1000 : 1000
        let springAnimation = spring({
            keyframes: [from, lastValue],
            ...state,
            duration,
        })
        let keyframes = []
        let t = 0
        let springTimeResolution = 10
        let status = { done: false, value: from }
        // let maxT = state.duration + 3 || 30
        while (!status.done) {
            status = springAnimation.next(t)
            keyframes.push(status.value)
            t += springTimeResolution
        }
        setChartData(
            keyframes.map((v, i) => ({
                time: i * springTimeResolution,
                value: v,
            })),
        )
    }, [state])
    let size = 40
    const container = useRef(null)
    let videoRef = useRef<HTMLVideoElement>(null)
    return (
        <div className='flex flex-col w-full items-center m-12'>
            {/* <pre className=''>{JSON.stringify(state, null, 4)}</pre> */}
            {/* <pre className=''>{JSON.stringify(chartData, null, 4)}</pre> */}
            <div className=' max-w-[1200px]'>
                <div className='flex gap-12'>
                    <div
                        ref={container}
                        className='bg-gray-100 p-[10px] items-start justify-center h-full flex rounded flex-col w-[600px]'
                    >
                        <LineChart
                            marginTop='mt-8'
                            data={chartData}
                            dataKey='time'
                            categories={['value']}
                            colors={['blue']}
                            showLegend={false}
                            valueFormatter={(x) => x.toFixed(0) + 'px'}
                            yAxisWidth='w-12'
                            showAnimation={false}
                            height='h-60'
                            startEndOnly={!!chartData.length}
                            // showXAxis={false}
                            // showGridLines={false}
                        />

                        {/* <motion.video
                        ref={videoRef}
                        src='https://threejs.org/examples/textures/sintel.ogv'
                        onLoad={() => {
                            setLoaded(true)
                        }}
                        controls
                        playsInline
                        autoPlay
                        muted
                        loop
                    /> */}
                    </div>
                    <div className='flex flex-col gap-6'>
                        <BadgeSelect.Container>
                            <BadgeSelect
                                onChange={(mode) => {
                                    setMode(mode as any)
                                    setState(initialState(mode))
                                }}
                                selected={mode}
                                options={['duration', 'mass'].map((x) => ({
                                    value: x,
                                    name: x,
                                }))}
                            />
                        </BadgeSelect.Container>
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
                                            playbackRate.stop()
                                            playbackRate.jump(0)
                                            setState((prev) => {
                                                return {
                                                    ...prev,
                                                    [key]: Number(
                                                        e.target.value,
                                                    ),
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
                <div className='mt-12'></div>
                <div className='flex flex-col items-center'>
                    <div
                        style={{ width: lastValue + size / 2 }}
                        className='relative items-start justify-center h-full flex rounded flex-col  self-center'
                    >
                        <div className='absolute h-1 rounded bg-gray-200 w-full'></div>
                        <motion.div
                            drag
                            dragConstraints={container}
                            // animate={controls}
                            style={{ x, width: size, height: size }}
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

                            className='z-1 relative rounded-full bg-blue-500'
                        ></motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const valueFormatterAbsolute = (number: number) =>
    Intl.NumberFormat('us').format(number).toString()

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
