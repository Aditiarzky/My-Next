import BarcodeScannerCamera from "@/components/BarcodeScannerCamera";

export default function Home() {
  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Aplikasi Scan Barcode</h1>
      <p style={{ textAlign: 'center' }}>Pilih metode scan yang Anda inginkan.</p>

      <hr style={{ margin: '40px 0' }} />

      {/* Fitur Scan dari Kamera */}
      <BarcodeScannerCamera />

      <hr style={{ margin: '40px 0' }} />
    </main>
  );
}