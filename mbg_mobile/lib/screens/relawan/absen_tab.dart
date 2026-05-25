import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import '../../providers/mbg_provider.dart';

class AbsenTab extends StatefulWidget {
  const AbsenTab({super.key});

  @override
  State<AbsenTab> createState() => _AbsenTabState();
}

class _AbsenTabState extends State<AbsenTab> {
  bool _isLoading = false;

  Future<void> _handleClockIn(BuildContext context, MbgProvider provider) async {
    setState(() {
      _isLoading = true;
    });

    final messenger = ScaffoldMessenger.of(context);

    try {
      // 1. Get Location
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Layanan GPS (Location Services) dinonaktifkan.');
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception('Izin lokasi ditolak.');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception('Izin lokasi ditolak secara permanen. Buka pengaturan aplikasi.');
      }

      Position position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
      String coordinates = '${position.latitude.toStringAsFixed(5)}, ${position.longitude.toStringAsFixed(5)}';

      // 2. Open Camera
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(
        source: ImageSource.camera,
        preferredCameraDevice: CameraDevice.front,
        imageQuality: 50,
      );

      if (image == null) {
        throw Exception('Pengambilan foto dibatalkan.');
      }

      // 3. Register Clock In
      provider.clockInVolunteer(File(image.path), coordinates);

      if (mounted) {
        messenger.showSnackBar(
          const SnackBar(
            content: Text('✓ Clock-in Relawan berhasil terdaftar!'),
            backgroundColor: Color(0xFFF43F5E),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        messenger.showSnackBar(
          SnackBar(
            content: Text(e.toString().replaceAll('Exception: ', '')),
            backgroundColor: Colors.red[800],
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MbgProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status Card
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
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundColor: provider.volunteerClockedIn
                          ? const Color(0xFFD1FAE5)
                          : const Color(0xFFFFE4E6),
                      child: Icon(
                        provider.volunteerClockedIn
                            ? Icons.verified_user_rounded
                            : Icons.no_accounts_rounded,
                        color: provider.volunteerClockedIn
                            ? const Color(0xFF10B981)
                            : const Color(0xFFF43F5E),
                        size: 36,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      provider.volunteerClockedIn ? 'STATUS: SEDANG BERTUGAS' : 'STATUS: BELUM CLOCK-IN',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        color: provider.volunteerClockedIn
                            ? const Color(0xFF10B981)
                            : const Color(0xFFF43F5E),
                        letterSpacing: 1.1,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      provider.volunteerClockedIn
                          ? 'Masuk pukul ${provider.volunteerTimeIn}'
                          : 'Silakan ambil selfie & ketuk tombol di bawah.',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[500],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Clock-in Area
            if (!provider.volunteerClockedIn) ...[
              // Camera Instruction Area
              Container(
                height: 180,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey[200]!, width: 1.5),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.add_a_photo_outlined, color: Colors.grey[400], size: 40),
                      const SizedBox(height: 10),
                      Text(
                        'Ambil Foto Selfie Presensi',
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey[500]),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Pastikan wajah terlihat jelas dan GPS aktif',
                        style: TextStyle(fontSize: 10, color: Colors.grey[400]),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Large Rose Button
              Center(
                child: Container(
                  width: 140,
                  height: 140,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: const Color(0xFFF43F5E).withOpacity(0.12),
                  ),
                  child: Center(
                    child: SizedBox(
                      width: 116,
                      height: 116,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : () => _handleClockIn(context, provider),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF43F5E),
                          foregroundColor: Colors.white,
                          shape: const CircleBorder(),
                          elevation: 6,
                          shadowColor: const Color(0xFFF43F5E).withOpacity(0.4),
                          disabledBackgroundColor: Colors.grey[300],
                        ),
                        child: _isLoading 
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.touch_app_rounded, size: 28),
                                SizedBox(height: 4),
                                Text(
                                  'CLOCK IN',
                                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 0.5),
                                ),
                              ],
                            ),
                      ),
                    ),
                  ),
                ),
              ),
            ] else ...[
              // Selfie display preview (REAL FILE!)
              Container(
                height: 180,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey[200]!, width: 1.5),
                  image: provider.volunteerPhoto != null
                      ? DecorationImage(
                          image: FileImage(provider.volunteerPhoto!),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black.withOpacity(0.6)],
                    ),
                  ),
                  padding: const EdgeInsets.all(16),
                  alignment: Alignment.bottomLeft,
                  child: const Row(
                    children: [
                      Icon(Icons.photo_camera_front_rounded, color: Colors.white, size: 16),
                      SizedBox(width: 8),
                      Text(
                        'Selfie Terverifikasi • Live GPS',
                        style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // REAL GPS Info Row
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey[200]!, width: 1.5),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.pin_drop_rounded, color: Color(0xFFF43F5E), size: 20),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'KOORDINAT PRESENSI REAL',
                            style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.grey),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            provider.volunteerCoordinates,
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              ElevatedButton.icon(
                onPressed: () {
                  provider.clockOutVolunteer();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('✓ Keluar tugas berhasil! Terima kasih atas dedikasi Anda.'),
                      backgroundColor: Colors.blueGrey,
                    ),
                  );
                },
                icon: const Icon(Icons.exit_to_app_rounded, size: 16),
                label: const Text('Keluar Tugas / Clock Out'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey[200],
                  foregroundColor: Colors.grey[700],
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
