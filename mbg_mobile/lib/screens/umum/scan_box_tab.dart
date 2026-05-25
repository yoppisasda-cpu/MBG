import 'package:flutter/material.dart';
import 'sertifikat_gizi_view.dart';

class ScanBoxTab extends StatefulWidget {
  const ScanBoxTab({super.key});

  @override
  State<ScanBoxTab> createState() => _ScanBoxTabState();
}

class _ScanBoxTabState extends State<ScanBoxTab> {
  bool _showScanner = false;

  void _triggerScan() {
    setState(() {
      _showScanner = true;
    });
  }

  void _confirmScan() {
    setState(() {
      _showScanner = false;
    });
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const SertifikatGiziView()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 24),
                // Scanning Landing Panel
                Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                    side: BorderSide(color: Colors.grey[200]!, width: 1.5),
                  ),
                  color: Colors.white,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 36.0),
                    child: Column(
                      children: [
                        // Icon circle
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: const Color(0xFF0EA5E9).withOpacity(0.08),
                            border: Border.all(color: const Color(0xFF0EA5E9).withOpacity(0.15), width: 1.5),
                          ),
                          child: const Icon(
                            Icons.qr_code_2_rounded,
                            color: Color(0xFF0EA5E9),
                            size: 40,
                          ),
                        ),
                        const SizedBox(height: 24),
                        const Text(
                          'Lacak Gizi & Keamanan Pangan',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Setiap box makanan program MBG memiliki label QR Code khusus. Pindai QR tersebut untuk melihat sertifikasi gizi, dapur pembuat, jam selesai memasak, hingga petani lokal yang menyuplai bahan bakunya!',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[500],
                            height: 1.5,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 28),

                        // Action scanner button
                        ElevatedButton.icon(
                          onPressed: _triggerScan,
                          icon: const Icon(Icons.qr_code_scanner_rounded, size: 20),
                          label: const Text('Mulai Scan Label Box'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0EA5E9),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            elevation: 0,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // SIMULATED VIEW FINDER
          if (_showScanner)
            Container(
              color: Colors.black.withOpacity(0.9),
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Scan Label Makanan',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close_rounded, color: Colors.white),
                            onPressed: () {
                              setState(() {
                                _showScanner = false;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 48),

                      // Viewfinder outline box
                      Container(
                        width: 220,
                        height: 220,
                        decoration: BoxDecoration(
                          border: Border.all(color: const Color(0xFF0EA5E9), width: 3, style: BorderStyle.solid),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: const Icon(
                          Icons.qr_code_2_rounded,
                          color: Colors.white24,
                          size: 140,
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        'Arahkan kamera HP ke label QR Code di tutup lunchbox...',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                      const SizedBox(height: 48),

                      // Simulate click button
                      ElevatedButton(
                        onPressed: _confirmScan,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          '✓ Simulasikan Scan Sukses',
                          style: TextStyle(fontWeight: FontWeight.w900),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
