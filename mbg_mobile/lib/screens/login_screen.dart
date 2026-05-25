import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/mbg_provider.dart';
import 'sekolah/sekolah_shell.dart';
import 'kurir/kurir_shell.dart';
import 'umum/umum_shell.dart';
import 'dapur/dapur_shell.dart';
import 'relawan/relawan_shell.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background Gradient Decor
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFF0F172A), // Slate 900
                  Color(0xFF1E293B), // Slate 800
                ],
              ),
            ),
          ),
          // Subtle glow decorative shapes
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF4F46E5).withOpacity(0.15), // Indigo glow
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF4F46E5).withOpacity(0.15),
                    blurRadius: 100,
                    spreadRadius: 50,
                  )
                ],
              ),
            ),
          ),
          Positioned(
            bottom: -80,
            left: -80,
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF0EA5E9).withOpacity(0.12), // Sky glow
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF0EA5E9).withOpacity(0.12),
                    blurRadius: 100,
                    spreadRadius: 50,
                  )
                ],
              ),
            ),
          ),

          // Main Layout Content
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Brand Icon & Header
                    const Icon(
                      Icons.health_and_safety_outlined,
                      size: 64,
                      color: Color(0xFFF59E0B), // Amber accent
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'MBG-OPS',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Sistem Operasional & Transparansi Gizi\nProgram Makan Bergizi Gratis',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.blueGrey[300],
                        height: 1.4,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 36),

                    Text(
                      'PILIH PERAN MASUK:',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Colors.blueGrey[400],
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Role Card 1: School Coordinator
                    _buildRoleCard(
                      context: context,
                      title: 'Koordinator Sekolah',
                      description: 'Update absensi harian kelas, scan terima makanan hangat, & ulas kualitas gizi.',
                      icon: Icons.school_outlined,
                      primaryColor: const Color(0xFFF59E0B), // Amber
                      onTap: () {
                        final provider = Provider.of<MbgProvider>(context, listen: false);
                        provider.setActiveRole('Sekolah');
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const SekolahShell()),
                        );
                      },
                    ),
                    const SizedBox(height: 12),

                    // Role Card 2: Dapur SPPG (Koki)
                    _buildRoleCard(
                      context: context,
                      title: 'Dapur SPPG (Koki)',
                      description: 'Pantau porsi masak reaktif dari absensi sekolah, kelola sanitasi, & rilis box makan.',
                      icon: Icons.soup_kitchen_outlined,
                      primaryColor: const Color(0xFF10B981), // Green
                      onTap: () {
                        final provider = Provider.of<MbgProvider>(context, listen: false);
                        provider.setActiveRole('Dapur');
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const DapurShell()),
                        );
                      },
                    ),
                    const SizedBox(height: 12),

                    // Role Card 3: Kurir Logistik
                    _buildRoleCard(
                      context: context,
                      title: 'Kurir Logistik',
                      description: 'Pantau daftar rute prioritas dapur, simulasikan transit GPS harian, & POD.',
                      icon: Icons.local_shipping_outlined,
                      primaryColor: const Color(0xFF8B5CF6), // Violet
                      onTap: () {
                        final provider = Provider.of<MbgProvider>(context, listen: false);
                        provider.setActiveRole('Kurir');
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const KurirShell()),
                        );
                      },
                    ),
                    const SizedBox(height: 12),

                    // Role Card 4: Relawan Peduli (BARU!)
                    _buildRoleCard(
                      context: context,
                      title: 'Relawan Gizi Peduli',
                      description: 'Presensi selfie & log GPS masuk tugas, serta pantau ceklis tugas distribusi.',
                      icon: Icons.favorite_border_rounded,
                      primaryColor: const Color(0xFFF43F5E), // Rose Pink
                      onTap: () {
                        final provider = Provider.of<MbgProvider>(context, listen: false);
                        provider.setActiveRole('Relawan');
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const RelawanShell()),
                        );
                      },
                    ),
                    const SizedBox(height: 12),

                    // Role Card 5: Public Portal
                    _buildRoleCard(
                      context: context,
                      title: 'Penerima Manfaat / Umum',
                      description: 'Scan label box makanan untuk lacak ketertelusuran petani lokal, koki, & skor gizi.',
                      icon: Icons.qr_code_scanner_outlined,
                      primaryColor: const Color(0xFF0EA5E9), // Sky Blue
                      onTap: () {
                        final provider = Provider.of<MbgProvider>(context, listen: false);
                        provider.setActiveRole('Umum');
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const UmumShell()),
                        );
                      },
                    ),

                    const SizedBox(height: 32),
                    Text(
                      'Uji Coba MVP Dapur SPPG Melati • Offline-First',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.blueGrey[500],
                        fontWeight: FontWeight.bold,
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

  Widget _buildRoleCard({
    required BuildContext context,
    required String title,
    required String description,
    required IconData icon,
    required Color primaryColor,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Ink(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            border: Border.all(
              color: Colors.white.withOpacity(0.08),
              width: 1.5,
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: primaryColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: primaryColor.withOpacity(0.2),
                    width: 1,
                  ),
                ),
                child: Icon(
                  icon,
                  color: primaryColor,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 14.5,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      description,
                      style: TextStyle(
                        fontSize: 11.2,
                        color: Colors.blueGrey[400],
                        height: 1.4,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios_rounded,
                color: Colors.blueGrey[500],
                size: 13,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
