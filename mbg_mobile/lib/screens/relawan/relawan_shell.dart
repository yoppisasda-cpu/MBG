import 'package:flutter/material.dart';
import 'absen_tab.dart';
import 'tugas_tab.dart';

class RelawanShell extends StatefulWidget {
  const RelawanShell({super.key});

  @override
  State<RelawanShell> createState() => _RelawanShellState();
}

class _RelawanShellState extends State<RelawanShell> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const AbsenTab(),
    const TugasTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFFF43F5E), // Warm Rose
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Relawan MBG Peduli',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
            ),
            Text(
              'Siti Rahma • Zona Jakarta Selatan',
              style: TextStyle(fontSize: 10.5, color: Colors.white70, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
        ],
      ),
      body: _tabs[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        selectedItemColor: const Color(0xFFF43F5E),
        unselectedItemColor: Colors.blueGrey[400],
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10),
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.co_present_outlined),
            activeIcon: Icon(Icons.co_present_rounded),
            label: 'Presensi',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.task_alt_outlined),
            activeIcon: Icon(Icons.task_alt_rounded),
            label: 'Tugas Hari Ini',
          ),
        ],
      ),
    );
  }
}
