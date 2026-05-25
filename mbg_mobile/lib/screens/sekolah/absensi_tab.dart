import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/mbg_provider.dart';

class AbsensiTab extends StatelessWidget {
  const AbsensiTab({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MbgProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // Slate 50
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Instruction Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF3C7), // Amber 100
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFFDE68A), width: 1),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: Color(0xFFD97706), size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Silakan sesuaikan absensi siswa pagi ini. Perubahan akan langsung merevisi target porsi masak Dapur SPPG Melati secara instan.',
                      style: TextStyle(
                        fontSize: 11.5,
                        color: const Color(0xFF92400E),
                        fontWeight: FontWeight.w600,
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Main Adjuster Panel
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(color: Colors.grey[200]!, width: 1.5),
              ),
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    Text(
                      'JUMLAH PORSI MAKAN HARI INI',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Colors.grey[400],
                        letterSpacing: 1.1,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Counter Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Minus Button
                        IconButton(
                          onPressed: provider.attendanceSubmitted
                              ? null
                              : () {
                                  if (provider.studentsCount > 50) {
                                    provider.updateStudentsCount(provider.studentsCount - 5);
                                  }
                                },
                          iconSize: 40,
                          color: const Color(0xFFF59E0B),
                          disabledColor: Colors.grey[300],
                          icon: const Icon(Icons.remove_circle_outline),
                        ),
                        
                        // Count text
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                          constraints: const BoxConstraints(minWidth: 100),
                          child: Text(
                            '${provider.studentsCount}',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 48,
                              fontWeight: FontWeight.w900,
                              color: provider.attendanceSubmitted
                                  ? Colors.grey[400]
                                  : const Color(0xFF0F172A),
                              fontFamily: 'Courier', // Clear alignment
                            ),
                          ),
                        ),

                        // Plus Button
                        IconButton(
                          onPressed: provider.attendanceSubmitted
                              ? null
                              : () {
                                  if (provider.studentsCount < 200) {
                                    provider.updateStudentsCount(provider.studentsCount + 5);
                                  }
                                },
                          iconSize: 40,
                          color: const Color(0xFFF59E0B),
                          disabledColor: Colors.grey[300],
                          icon: const Icon(Icons.add_circle_outline),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Standard label info
                    Text(
                      'Target Terdaftar: ${provider.originalCount} Siswa',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Submit Button Action
            if (provider.attendanceSubmitted) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFD1FAE5), // Emerald 100
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.check_circle_rounded, color: Color(0xFF059669), size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Terkirim! Dapur Sedang Menyiapkan Masakan.',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF065F46),
                      ),
                    ),
                  ],
                ),
              ),
            ] else ...[
              ElevatedButton(
                onPressed: () {
                  provider.submitAttendance();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Absensi terkirim secara reaktif ke Dapur SPPG!'),
                      backgroundColor: Color(0xFF10B981),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF59E0B),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Kirim Update Kehadiran',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
