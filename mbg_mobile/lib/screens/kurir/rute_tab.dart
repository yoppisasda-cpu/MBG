import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/mbg_provider.dart';
import 'gps_sim_screen.dart';

class RuteTab extends StatelessWidget {
  const RuteTab({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MbgProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'DAFTAR TUGAS PENGANTARAN HARI INI:',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: Colors.grey[400],
                letterSpacing: 1.1,
              ),
            ),
            const SizedBox(height: 12),

            Expanded(
              child: ListView.builder(
                itemCount: provider.deliveries.length,
                itemBuilder: (context, index) {
                  final del = provider.deliveries[index];
                  final isDone = del['status'] == 'Selesai';
                  final isWaiting = del['status'] == 'Menunggu Dapur';

                  return GestureDetector(
                    onTap: () {
                      provider.setActiveDeliveryId(del['id']);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const GpsSimScreen()),
                      );
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: provider.activeDeliveryId == del['id']
                              ? const Color(0xFF8B5CF6)
                              : Colors.grey[200]!,
                          width: provider.activeDeliveryId == del['id'] ? 2.0 : 1.5,
                        ),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        del['schoolName'],
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF0F172A),
                                        ),
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: isDone
                                            ? const Color(0xFFD1FAE5)
                                            : isWaiting
                                                ? const Color(0xFFFEF3C7)
                                                : const Color(0xFFDBEAFE),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        del['status'],
                                        style: TextStyle(
                                          fontSize: 9,
                                          fontWeight: FontWeight.w900,
                                          color: isDone
                                              ? const Color(0xFF065F46)
                                              : isWaiting
                                                  ? const Color(0xFF92400E)
                                                  : const Color(0xFF1E40AF),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      '📦 ${del['porsi']} Porsi',
                                      style: TextStyle(
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.w700,
                                        color: Colors.grey[500],
                                      ),
                                    ),
                                    Text(
                                      '🌡️ ${del['temp']}',
                                      style: TextStyle(
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.w700,
                                        color: Colors.grey[500],
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Icon(
                            Icons.arrow_forward_ios_rounded,
                            color: Colors.grey[400],
                            size: 14,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
