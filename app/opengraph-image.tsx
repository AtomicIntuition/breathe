import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'BREATHE SPEC - Train Your Breath. Master Your Mind.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A1628 0%, #0F172A 50%, #0A1628 100%)',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74, 144, 217, 0.25) 0%, transparent 70%)',
            top: 40,
          }}
        />

        {/* Outer breathing circle */}
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: '50%',
            border: '2px solid rgba(74, 144, 217, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Middle ring */}
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: '50%',
              border: '2px solid rgba(74, 144, 217, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Inner breathing circle */}
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(74, 144, 217, 0.4) 0%, rgba(15, 23, 42, 0.9) 60%)',
                border: '2px solid rgba(74, 144, 217, 0.8)',
                boxShadow: '0 0 40px rgba(74, 144, 217, 0.4), inset 0 0 30px rgba(74, 144, 217, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Inner core */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(74, 144, 217, 0.6) 0%, transparent 70%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            BREATHE SPEC
          </div>
          <div
            style={{
              fontSize: 26,
              color: '#94A3B8',
              marginTop: 12,
            }}
          >
            Train Your Breath. Master Your Mind.
          </div>
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 30,
          }}
        >
          <div
            style={{
              background: 'rgba(74, 144, 217, 0.15)',
              border: '1px solid rgba(74, 144, 217, 0.3)',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#4A90D9',
              fontSize: 16,
            }}
          >
            14 Techniques
          </div>
          <div
            style={{
              background: 'rgba(201, 162, 39, 0.15)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#C9A227',
              fontSize: 16,
            }}
          >
            Navy SEAL Methods
          </div>
          <div
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#8B5CF6',
              fontSize: 16,
            }}
          >
            Science-Backed
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
