import 'package:flutter/material.dart';
import 'masak_tab.dart';
import 'qc_tab.dart';
import 'rilis_tab.dart';

class DapurShell extends StatefulWidget {
  const DapurShell({super.key});

  @override
  State<DapurShell> createState() => _DapurShellState();
}

class _DapurShellState extends State<DapurShell> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const MasakTab(),
    const QcTab(),
    const RilisTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF10B981), // Green themed
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Dapur SPPG Melati',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
            ),
            Text(
              'Koki Utama • Kebayoran',
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
        selectedItemColor: const Color(0xFF10B981),
        unselectedItemColor: Colors.blueGrey[400],
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w900, fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10),
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.soup_kitchen_outlined),
            activeIcon: Icon(Icons.soup_kitchen_rounded),
            label: 'Masak',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.clean_hands_outlined),
            activeIcon: Icon(Icons.clean_hands_rounded),
            label: 'QC Higienis',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.local_shipping_outlined),
            activeIcon: Icon(Icons.local_shipping_rounded),
            label: 'Rilis & Kirim',
          ),
        ],
      ),
    );
  }
}
