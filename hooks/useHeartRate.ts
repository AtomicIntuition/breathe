'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface HeartRateState {
  bpm: number | null
  signal: number[]
  isReading: boolean
  isCalibrating: boolean
  fingerDetected: boolean
  error: string | null
}

const SAMPLE_RATE = 30
const BUFFER_SIZE = SAMPLE_RATE * 10 // 10 seconds of data
const MIN_PEAK_DISTANCE = Math.floor(SAMPLE_RATE * 0.35) // ~170 bpm max
const CALIBRATION_SAMPLES = SAMPLE_RATE * 3 // 3 seconds to calibrate
const RED_THRESHOLD = 80 // minimum red channel avg to consider finger present

export function useHeartRate() {
  const [state, setState] = useState<HeartRateState>({
    bpm: null,
    signal: [],
    isReading: false,
    isCalibrating: false,
    fingerDetected: false,
    error: null,
  })

  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const bufferRef = useRef<number[]>([])
  const rafRef = useRef<number>(0)
  const sampleCountRef = useRef(0)
  const lastSampleTimeRef = useRef(0)
  const bpmHistoryRef = useRef<number[]>([])

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    bufferRef.current = []
    sampleCountRef.current = 0
    bpmHistoryRef.current = []
  }, [])

  const detectPeaks = useCallback((signal: number[]): number[] => {
    if (signal.length < SAMPLE_RATE * 2) return []

    // Smooth signal with a simple moving average (window=5)
    const smoothed: number[] = []
    const w = 5
    for (let i = 0; i < signal.length; i++) {
      let sum = 0
      let count = 0
      for (let j = Math.max(0, i - w); j <= Math.min(signal.length - 1, i + w); j++) {
        sum += signal[j]
        count++
      }
      smoothed.push(sum / count)
    }

    // Calculate adaptive threshold (rolling mean)
    const mean = smoothed.reduce((a, b) => a + b, 0) / smoothed.length
    const std = Math.sqrt(smoothed.reduce((a, b) => a + (b - mean) ** 2, 0) / smoothed.length)
    const threshold = mean + std * 0.3

    // Find peaks above threshold with minimum distance
    const peaks: number[] = []
    for (let i = 2; i < smoothed.length - 2; i++) {
      if (
        smoothed[i] > threshold &&
        smoothed[i] > smoothed[i - 1] &&
        smoothed[i] > smoothed[i - 2] &&
        smoothed[i] >= smoothed[i + 1] &&
        smoothed[i] >= smoothed[i + 2]
      ) {
        if (peaks.length === 0 || i - peaks[peaks.length - 1] >= MIN_PEAK_DISTANCE) {
          peaks.push(i)
        }
      }
    }

    return peaks
  }, [])

  const calculateBPM = useCallback((peaks: number[]): number | null => {
    if (peaks.length < 3) return null

    // Calculate intervals between consecutive peaks
    const intervals: number[] = []
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1])
    }

    // Remove outliers (intervals that deviate too much from median)
    intervals.sort((a, b) => a - b)
    const median = intervals[Math.floor(intervals.length / 2)]
    const filtered = intervals.filter(
      iv => iv > median * 0.7 && iv < median * 1.3
    )

    if (filtered.length < 2) return null

    const avgInterval = filtered.reduce((a, b) => a + b, 0) / filtered.length
    const bpm = Math.round((SAMPLE_RATE / avgInterval) * 60)

    // Sanity check: 40-200 bpm
    if (bpm < 40 || bpm > 200) return null

    return bpm
  }, [])

  const processFrame = useCallback(() => {
    if (!videoRef.current || !ctxRef.current || !canvasRef.current) {
      rafRef.current = requestAnimationFrame(processFrame)
      return
    }

    const now = performance.now()
    const elapsed = now - lastSampleTimeRef.current

    // Sample at ~30fps
    if (elapsed < 1000 / SAMPLE_RATE) {
      rafRef.current = requestAnimationFrame(processFrame)
      return
    }
    lastSampleTimeRef.current = now

    const canvas = canvasRef.current
    const ctx = ctxRef.current
    const video = videoRef.current

    // Draw video to small canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    // Calculate average red channel
    let redSum = 0
    let greenSum = 0
    const pixelCount = pixels.length / 4
    for (let i = 0; i < pixels.length; i += 4) {
      redSum += pixels[i]
      greenSum += pixels[i + 1]
    }
    const redAvg = redSum / pixelCount
    const greenAvg = greenSum / pixelCount

    // Finger detection: when finger covers camera with flash, red channel is very high
    const fingerOn = redAvg > RED_THRESHOLD && redAvg > greenAvg * 1.2

    // Push to buffer (use inverted red for cleaner peaks - blood absorption dips)
    bufferRef.current.push(redAvg)
    if (bufferRef.current.length > BUFFER_SIZE) {
      bufferRef.current.shift()
    }
    sampleCountRef.current++

    const isCalibrating = sampleCountRef.current < CALIBRATION_SAMPLES

    let bpm: number | null = null
    if (fingerOn && !isCalibrating && bufferRef.current.length >= SAMPLE_RATE * 4) {
      const peaks = detectPeaks(bufferRef.current)
      bpm = calculateBPM(peaks)

      // Smooth BPM with a rolling average
      if (bpm !== null) {
        bpmHistoryRef.current.push(bpm)
        if (bpmHistoryRef.current.length > 5) bpmHistoryRef.current.shift()
        bpm = Math.round(
          bpmHistoryRef.current.reduce((a, b) => a + b, 0) / bpmHistoryRef.current.length
        )
      }
    }

    // Downsample signal for visualization (keep last 100 points)
    const visSignal = bufferRef.current.slice(-100)

    setState({
      bpm,
      signal: visSignal,
      isReading: true,
      isCalibrating,
      fingerDetected: fingerOn,
      error: null,
    })

    rafRef.current = requestAnimationFrame(processFrame)
  }, [detectPeaks, calculateBPM])

  const start = useCallback(async () => {
    try {
      cleanup()

      // Create video and canvas elements
      const video = document.createElement('video')
      video.setAttribute('playsinline', '')
      video.setAttribute('autoplay', '')
      video.muted = true
      videoRef.current = video

      const canvas = document.createElement('canvas')
      canvas.width = 40
      canvas.height = 40
      canvasRef.current = canvas
      ctxRef.current = canvas.getContext('2d', { willReadFrequently: true })

      // Request camera with torch
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 64 },
          height: { ideal: 64 },
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      // Try to enable torch
      const track = stream.getVideoTracks()[0]
      const capabilities = track.getCapabilities?.() as Record<string, unknown> | undefined
      if (capabilities?.torch) {
        await track.applyConstraints({
          advanced: [{ torch: true } as MediaTrackConstraintSet],
        })
      }

      video.srcObject = stream
      await video.play()

      setState(prev => ({
        ...prev,
        isReading: true,
        isCalibrating: true,
        error: null,
      }))

      lastSampleTimeRef.current = performance.now()
      sampleCountRef.current = 0
      rafRef.current = requestAnimationFrame(processFrame)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Camera access denied'
      setState(prev => ({
        ...prev,
        error: message.includes('NotAllowed') || message.includes('denied')
          ? 'Camera permission needed for heart rate'
          : 'Could not access camera',
        isReading: false,
      }))
    }
  }, [cleanup, processFrame])

  const stop = useCallback(() => {
    cleanup()
    setState({
      bpm: null,
      signal: [],
      isReading: false,
      isCalibrating: false,
      fingerDetected: false,
      error: null,
    })
  }, [cleanup])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  return {
    ...state,
    start,
    stop,
  }
}
