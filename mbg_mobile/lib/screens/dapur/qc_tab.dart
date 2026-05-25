import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/mbg_provider.dart';

class QcTab extends StatefulWidget {
  const QcTab({super.key});

  @override
  State<QcTab> createState() => _QcTabState();
}

class _QcTabState extends State<QcTab> {
  final List<Map<String, dynamic>> _checkpoints = [
    {
      'title': 'Kru memasak memakai penutup kepala & sarung tangan steril.',
      'checked': false,
    },
    {
      'title': 'Suhu makanan matang terukur minimal 65°C.',
      'checked': false,
    },
    {
      'title': 'Lunchbox disterilisasi sebelum dikemas.',
      'checked': false,
    },
    {
      'title': 'Bahan baku pangan dibilas air mengalir bersih.',
      'checked': false,
    },
  ];

  bool get _allChecked => _checkpoints.every((cp) => cp['checked'] == true);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MbgProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (provider.hygieneChecked) ...[
              // Certified safe panel
              Container(
                padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.grey[200]!, width: 1.5),
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.gpp_good_rounded,
                      color: Color(0xFF10B981),
                      size: 64,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'QC GIZI & HIGIENIS PASSED',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Dapur SPPG Melati terverifikasi memenuhi standar Dinas Kesehatan. Sertifikasi higienis tersemat otomatis pada label QR box makanan publik.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 11.5,
                        color: Colors.grey[500],
                        height: 1.4,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ] else ...[
              // Checklist card
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
                        'CHECKLIST QC & SANITASI KITCHEN',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: Colors.grey,
                          letterSpacing: 1.0,
                        ),
                      ),
                      const SizedBox(height: 16),

                      ...List.generate(_checkpoints.length, (index) {
                        final cp = _checkpoints[index];
                        return CheckboxListTile(
                          value: cp['checked'],
                          onChanged: (val) {
                            setState(() {
                              _checkpoints[index]['checked'] = val;
                            });
                          },
                          title: Text(
                            cp['title'],
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF334155)),
                          ),
                          activeColor: const Color(0xFF10B981),
                          contentPadding: EdgeInsets.zero,
                          controlAffinity: ListTileControlAffinity.leading,
                        );
                      }),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: !_allChecked
                    ? null
                    : () {
                        provider.submitHygieneQC();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('✓ QC Higienis sukses terverifikasi!'),
                            backgroundColor: Color(0xFF10B981),
                          ),
                        );
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: Colors.grey[200],
                  disabledForegroundColor: Colors.grey[400],
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Kunci Sertifikasi QC Dapur',
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
