import 'package:flutter/material.dart';
import 'rute_tab.dart';

class KurirShell extends StatelessWidget {
  const KurirShell({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF8B5CF6), // Violet color
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Joko Prabowo (Kurir #4)',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
            ),
            Text(
              'SPPG Melati Kebayoran • Aktif',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFEDE9FE)),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, size: 20),
            onPressed: () {
              Navigator.pop(context);
            },
            tooltip: 'Ganti Peran',
          ),
        ],
      ),
      body: const RuteTab(),
    );
  }
}
