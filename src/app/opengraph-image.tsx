import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Auto-Content Factory - Tự động hoá content, giữ giọng brand'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 32,
          padding: 80,
          background: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              background: '#E63946',
              borderRadius: 16,
              color: 'white',
              fontSize: 56,
              fontWeight: 800,
            }}
          >
            A
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 52,
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
            }}
          >
            Auto-Content Factory
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              maxWidth: 1040,
            }}
          >
            Tự động hoá content. Giữ giọng brand.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 36,
              fontWeight: 500,
              color: '#64748b',
              marginTop: 16,
            }}
          >
            Cho chủ doanh nghiệp Việt.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: '#E63946',
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              fontWeight: 600,
              color: '#475569',
              letterSpacing: '-0.01em',
            }}
          >
            autocontent.online
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
