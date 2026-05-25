import 'package:flutter/material.dart';
import 'absensi_tab.dart';
import 'terima_tab.dart';
import 'ulas_tab.dart';

class SekolahShell extends StatefulWidget {
  const SekolahShell({super.key});

  @override
  State<SekolahShell> createState() => _SekolahShellState();
}

class _SekolahShellState extends State<SekolahShell> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const AbsensiTab(),
    const TerimaTab(),
    const UlasTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFFF59E0B), // Amber color
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'SDN 01 Kebayoran Lama',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
            ),
            Text(
              'Koordinator Penerima • Aktif',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFFEF3C7)),
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
      body: _tabs[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 10,
              offset: const Offset(0, -4),
            )
          ]
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          selectedItemColor: const Color(0xFFF59E0B),
          unselectedItemColor: Colors.blueGrey[400],
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10),
          showUnselectedLabels: true,
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.edit_calendar_outlined),
              activeIcon: Icon(Icons.edit_calendar_rounded),
              label: 'Absen',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.qr_code_scanner_outlined),
              activeIcon: Icon(Icons.qr_code_scanner_rounded),
              label: 'Terima',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.rate_review_outlined),
              activeIcon: Icon(Icons.rate_review_rounded),
              label: 'Ulas',
            ),
          ],
        ),
      ),
    );
  }
}
