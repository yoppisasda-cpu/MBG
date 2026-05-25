import 'package:flutter/material.dart';
import 'scan_box_tab.dart';

class UmumShell extends StatelessWidget {
  const UmumShell({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0EA5E9), // Sky blue
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Portal Transparansi MBG',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
            ),
            Text(
              'Rantai Pangan Adil & Terbuka • Umum',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFE0F2FE)),
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
      body: const ScanBoxTab(),
    );
  }
}
