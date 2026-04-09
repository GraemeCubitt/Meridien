'use client'

interface BlobsProps {
  isLight: boolean
}

export default function Blobs({ isLight }: BlobsProps) {
  return (
    <>
      <div className="blob-canvas" aria-hidden="true">
        {/* Dark mode — purple orbs */}
        <div className={`blob d1 ${isLight ? 'gone' : ''}`} />
        <div className={`blob d2 ${isLight ? 'gone' : ''}`} />
        <div className={`blob d3 ${isLight ? 'gone' : ''}`} />
        <div className={`blob d4 ${isLight ? 'gone' : ''}`} />

        {/* Light mode — tan/brown blocks */}
        <div className={`blob l1 ${isLight ? '' : 'gone'}`} />
        <div className={`blob l2 ${isLight ? '' : 'gone'}`} />
        <div className={`blob l3 ${isLight ? '' : 'gone'}`} />
        <div className={`blob l4 ${isLight ? '' : 'gone'}`} />
      </div>

      <style>{`
        .blob-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .blob {
          position: absolute;
          filter: blur(80px);
          transition: opacity 0.9s ease;
        }
        .blob.gone { opacity: 0 !important; }

        /* ── Dark blobs ── */
        .d1 {
          width: 560px; height: 560px;
          background: radial-gradient(circle, #6b21e8 0%, transparent 68%);
          top: -140px; left: -100px;
          opacity: 0.45;
          border-radius: 50%;
          animation: drift1 24s ease-in-out infinite alternate;
        }
        .d2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #9b6dff 0%, transparent 68%);
          top: 28%; right: -80px;
          opacity: 0.38;
          border-radius: 50%;
          animation: drift2 17s ease-in-out infinite alternate;
        }
        .d3 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, #c084fc 0%, transparent 68%);
          bottom: -90px; left: 28%;
          opacity: 0.32;
          border-radius: 50%;
          animation: drift3 21s ease-in-out infinite alternate;
        }
        .d4 {
          width: 220px; height: 220px;
          background: radial-gradient(circle, #7c3aed 0%, transparent 68%);
          bottom: 22%; left: 8%;
          opacity: 0.28;
          border-radius: 50%;
          animation: drift4 14s ease-in-out infinite alternate;
        }

        /* ── Light blobs — blockier, earthier ── */
        .l1 {
          width: 540px; height: 440px;
          background: radial-gradient(ellipse, rgba(160,118,68,0.65) 0%, transparent 70%);
          top: -120px; left: -110px;
          opacity: 0.55;
          border-radius: 38% 62% 54% 46% / 52% 48% 60% 40%;
          animation: drift1 22s ease-in-out infinite alternate;
        }
        .l2 {
          width: 380px; height: 280px;
          background: radial-gradient(ellipse, rgba(190,148,94,0.5) 0%, transparent 70%);
          top: 38%; right: -50px;
          opacity: 0.45;
          border-radius: 62% 38% 48% 52% / 44% 56% 42% 58%;
          animation: drift2 16s ease-in-out infinite alternate;
        }
        .l3 {
          width: 300px; height: 340px;
          background: radial-gradient(ellipse, rgba(140,98,56,0.45) 0%, transparent 70%);
          bottom: -70px; left: 22%;
          opacity: 0.4;
          border-radius: 44% 56% 62% 38% / 58% 42% 54% 46%;
          animation: drift3 19s ease-in-out infinite alternate;
        }
        .l4 {
          width: 200px; height: 240px;
          background: radial-gradient(ellipse, rgba(178,128,76,0.4) 0%, transparent 70%);
          bottom: 28%; right: 28%;
          opacity: 0.35;
          border-radius: 54% 46% 40% 60% / 62% 38% 56% 44%;
          animation: drift4 13s ease-in-out infinite alternate;
        }

        @keyframes drift1 {
          0%   { transform: translate(0,    0)    scale(1);    }
          40%  { transform: translate(28px, -36px) scale(1.07); }
          100% { transform: translate(42px,  14px) scale(1.04); }
        }
        @keyframes drift2 {
          0%   { transform: translate(0,    0)    scale(1);    }
          50%  { transform: translate(-22px, 30px) scale(0.95); }
          100% { transform: translate(18px, -18px) scale(1.06); }
        }
        @keyframes drift3 {
          0%   { transform: translate(0,    0)    scale(1);    }
          35%  { transform: translate(34px,  20px) scale(1.08); }
          100% { transform: translate(-14px, -30px) scale(0.96); }
        }
        @keyframes drift4 {
          0%   { transform: translate(0, 0)     scale(1);    }
          60%  { transform: translate(-18px, 24px) scale(1.1); }
          100% { transform: translate(22px, -10px) scale(0.97); }
        }
      `}</style>
    </>
  )
}
