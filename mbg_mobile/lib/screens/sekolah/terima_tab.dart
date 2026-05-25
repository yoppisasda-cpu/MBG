import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/mbg_provider.dart';

class TerimaTab extends StatefulWidget {
  const TerimaTab({super.key});

  @override
  State<TerimaTab> createState() => _TerimaTabState();
}

class _TerimaTabState extends State<TerimaTab> {
  bool _showViewfinder = false;

  void _triggerSimulatedScan(MbgProvider provider) {
    setState(() {
      _showViewfinder = true;
    });
  }

  void _confirmScan(MbgProvider provider) {
    setState(() {
      _showViewfinder = false;
    });
    provider.verifyDelivery();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✓ Serah terima digital tervalidasi!'),
        backgroundColor: Color(0xFF10B981),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MbgProvider>(context);
    final del = provider.activeDelivery;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Delivery Status Panel
                Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                    side: BorderSide(color: Colors.grey[200]!, width: 1.5),
                  ),
                  color: Colors.white,
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'LOGISTIK HARI INI',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: Colors.grey,
                                letterSpacing: 1.1,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: provider.deliveryVerified
                                    ? const Color(0xFFD1FAE5)
                                    : const Color(0xFFDBEAFE),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                provider.deliveryVerified ? 'Selesai' : del['status'],
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  color: provider.deliveryVerified
                                      ? const Color(0xFF065F46)
                                      : const Color(0xFF1E40AF),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Menu: ${provider.foodCertificate['menuName']}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Porsi Dikirim: ${del['porsi']} Box Gizi',
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w700,
                            color: Colors.grey[600],
                          ),
                        ),
                        const Divider(height: 24),

                        // Transit logs details
                        Row(
                          children: [
                            Icon(Icons.directions_bike_rounded, color: Colors.grey[400], size: 18),
                            const SizedBox(width: 8),
                            Text(
                              'Kurir: ${del['courier']}',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.grey[700],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(Icons.thermostat_outlined, color: Colors.grey[400], size: 18),
                            const SizedBox(width: 8),
                            Text(
                              'Suhu Box: ${provider.deliveryVerified ? "50°C" : del['temp']}',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.grey[700],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Active Handover action
                if (provider.deliveryVerified) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD1FAE5),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFA7F3D0), width: 1.5),
                    ),
                    child: Column(
                      children: [
                        const Icon(
                          Icons.verified_rounded,
                          color: Color(0xFF10B981),
                          size: 48,
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Makanan Diterima!',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF065F46),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Serah terima selesai pada ${del['timeCompleted']}. Silakan beralih ke tab **Ulas** untuk memberi penilaian gizi anak.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 11.5,
                            color: const Color(0xFF047857),
                            fontWeight: FontWeight.w600,
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ] else ...[
                  // Instruction to scan QR
                  ElevatedButton.icon(
                    onPressed: () => _triggerSimulatedScan(provider),
                    icon: const Icon(Icons.qr_code_scanner_rounded, size: 20),
                    label: const Text('Scan QR Terima Makanan'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF59E0B),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '*Minta kurir membuka **QR Code Serah Terima** di handphonenya terlebih dahulu untuk Anda scan.*',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[400],
                      height: 1.4,
                    ),
                  ),
                ],
              ],
            ),
          ),

          // SIMULATED VIEWFINDER MODAL
          if (_showViewfinder)
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
                            'Scan QR Logistik',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close_rounded, color: Colors.white),
                            onPressed: () {
                              setState(() {
                                _showViewfinder = false;
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
                          border: Border.all(color: const Color(0xFFF59E0B), width: 3, style: BorderStyle.solid),
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
                        'Arahkan kamera HP ke QR Code milik Kurir...',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                      const SizedBox(height: 48),

                      // Simulate click button
                      ElevatedButton(
                        onPressed: () => _confirmScan(provider),
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
