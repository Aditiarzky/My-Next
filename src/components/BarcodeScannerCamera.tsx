// app/components/BarcodeScannerCamera.tsx

'use client'; // Komponen ini harus client-side karena interaktif dan akses hardware

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

const BarcodeScannerCamera = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // ID dari elemen div di mana scanner akan dirender
    const scannerId = 'qr-reader';

    // Konfigurasi scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    };

    // Inisialisasi scanner
    scannerRef.current = new Html5QrcodeScanner(scannerId, config, /* verbose= */ false);

    // Fungsi yang dipanggil saat scan berhasil
    const onScanSuccess = (decodedText: string, decodedResult: unknown) => {
      setScanResult(decodedText);
      console.log(`Scan berhasil: ${decodedText}`, decodedResult);
      // Anda bisa menghentikan scanner setelah berhasil scan
      scannerRef.current?.clear();
    };

    // Fungsi yang dipanggil saat scan gagal (dipanggil terus-menerus)
    const onScanFailure = (error: unknown) => {
      console.warn(`Scan gagal: ${error}`);
      // Biasanya tidak perlu menampilkan error kecuali untuk debugging
    };

    // Memulai scanner
    scannerRef.current.render(onScanSuccess, onScanFailure);

    // Cleanup function saat komponen di-unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Gagal membersihkan scanner:", error);
        });
      }
    };
  }, []); // useEffect dijalankan sekali saat komponen mount

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Scan dari Kamera</h2>
      <p>Arahkan kamera ke barcode atau QR code.</p>
      <div id="qr-reader" style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}></div>
      {scanResult && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid green', borderRadius: '5px' }}>
          <h3>Hasil Scan:</h3>
          <p>{scanResult}</p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerCamera;