import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/mbg_provider.dart';

class GpsSimScreen extends StatefulWidget {
  const GpsSimScreen({super.key});

  @override
  State<GpsSimScreen> createState() => _GpsSimScreenState();
}

class _GpsSimScreenState extends State<GpsSimScreen> {
  bool _showQrModal = false;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MbgProvider>(context);
    final del = provider.activeDelivery;
    final isDone = del['status'] == 'Selesai';
    final isWaiting = del['status'] == 'Menunggu Dapur';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF8B5CF6),
        foregroundColor: Colors.white,
        elevation: 0,
        title: Text(
          del['schoolName'],
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
        ),
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Origin & Destination card
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
                        const Text(
                          '🗺️ RUTE DISPATCH LOGISTIK',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: Colors.grey,
                            letterSpacing: 1.1,
                          ),
                        ),
                        const SizedBox(height: 16),
                        _buildRouteNode(
                          icon: Icons.kitchen_outlined,
                          nodeName: 'SPPG Melati Kebayoran',
                          nodeRole: 'Pabrik Masak Asal',
                          color: const Color(0xFF10B981),
                        ),
                        _buildRouteLine(),
                        _buildRouteNode(
                          icon: Icons.school_rounded,
                          nodeName: del['schoolName'],
                          nodeRole: 'Sekolah Penerima Porsi',
                          color: const Color(0xFFF59E0B),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // GPS Simulator panel
                if (isWaiting) ...[
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFFDE68A)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.warning_amber_rounded, color: Color(0xFFD97706)),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Makanan belum dirilis dari Dapur SPPG. Silakan buka Dashboard Dapur Web untuk klik "Rilis & Kirim Makanan" terlebih dahulu.',
                            style: TextStyle(fontSize: 11, color: Color(0xFF92400E), fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ] else if (isDone) ...[
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD1FAE5),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFA7F3D0)),
                    ),
                    child: const Column(
                      children: [
                        Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 48),
                        SizedBox(height: 8),
                        Text(
                          'Pengantaran Selesai!',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF065F46)),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Serah terima makanan tervalidasi menggunakan tanda tangan QR Code.',
                          style: TextStyle(fontSize: 11, color: Color(0xFF047857), fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ] else ...[
                  // TRANSIT ACTIVE SIMULATOR PANEL
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
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'TRANSIT ACTIVE GPS',
                                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.grey),
                              ),
                              Text(
                                '${provider.transitProgress.toInt()}%',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF8B5CF6)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          
                          // Custom progress bar
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: provider.transitProgress / 100.0,
                              color: const Color(0xFF8B5CF6),
                              backgroundColor: Colors.grey[100],
                              minHeight: 8,
                            ),
                          ),
                          const SizedBox(height: 12),

                          Row(
                            children: [
                              Icon(Icons.compass_calibration_outlined, size: 14, color: Colors.grey[400]),
                              const SizedBox(width: 6),
                              Text(
                                'GPS: ${provider.currentCoordinates}',
                                style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Colors.grey[500]),
                              ),
                            ],
                          ),
                          const Divider(height: 24),

                          if (provider.transitProgress < 100.0) ...[
                            ElevatedButton.icon(
                              onPressed: provider.isSimulating
                                  ? null
                                  : () => provider.startGpsSimulation(),
                              icon: const Icon(Icons.play_circle_outline_rounded),
                              label: Text(provider.isSimulating ? 'Sedang Transit...' : 'Simulasikan Perjalanan'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF8B5CF6),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 0,
                              ),
                            ),
                          ] else ...[
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFD1FAE5),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.location_on_rounded, color: Color(0xFF059669), size: 16),
                                  SizedBox(width: 6),
                                  Text(
                                    'Kurir Tiba di Sekolah',
                                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF065F46)),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 12),
                            ElevatedButton.icon(
                              onPressed: () {
                                setState(() {
                                  _showQrModal = true;
                                });
                              },
                              icon: const Icon(Icons.qr_code_2_rounded),
                              label: const Text('Tampilkan QR Terima'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF8B5CF6),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 0,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),

          // QR CODE POPUP MODAL
          if (_showQrModal)
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
                            'QR Serah Terima Gizi',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close_rounded, color: Colors.white),
                            onPressed: () {
                              setState(() {
                                _showQrModal = false;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),
                      const Text(
                        'Minta pihak Sekolah untuk memindai QR Code ini menggunakan pemindai HP mereka.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 12, height: 1.4),
                      ),
                      const SizedBox(height: 24),

                      // QR Box
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.qr_code_2_rounded,
                              color: Color(0xFF8B5CF6),
                              size: 140,
                            ),
                            const SizedBox(height: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.grey[100],
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                'ID: ${del['id']}-${del['porsi']}p',
                                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Manual Close button
                      TextButton(
                        onPressed: () {
                          setState(() {
                            _showQrModal = false;
                          });
                        },
                        child: const Text(
                          'Tutup',
                          style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
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

  Widget _buildRouteNode({
    required IconData icon,
    required String nodeName,
    required String nodeRole,
    required Color color,
  }) {
    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: color.withOpacity(0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 18),
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              nodeName,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 2),
            Text(
              nodeRole,
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey[400]),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRouteLine() {
    return Container(
      margin: const EdgeInsets.only(left: 17, top: 4, bottom: 4),
      height: 20,
      width: 2,
      color: Colors.grey[200],
    );
  }
}
