'use client'
import '../styles/blobs.css'

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
    </>
  )
}
