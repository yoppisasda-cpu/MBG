import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/mbg_provider.dart';

class SertifikatGiziView extends StatefulWidget {
  const SertifikatGiziView({super.key});

  @override
  State<SertifikatGiziView> createState() => _SertifikatGiziViewState();
}

class _SertifikatGiziViewState extends State<SertifikatGiziView> {
  final TextEditingController _feedbackController = TextEditingController();
  bool _sent = false;
  double _localRating = 5.0;

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MbgProvider>(context);
    final cert = provider.foodCertificate;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0EA5E9),
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Sertifikat Gizi Aman',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Safe Food Award Certificate Card
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: BorderSide(color: Colors.grey[200]!, width: 1.5),
              ),
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Green Award Banner
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFD1FAE5),
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(color: const Color(0xFFA7F3D0)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.verified_user_rounded, color: Color(0xFF059669), size: 14),
                          SizedBox(width: 6),
                          Text(
                            'HIGIENIS & SANITASI DINAS LULUS',
                            style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF065F46)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    Text(
                      cert['menuName'],
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const Divider(height: 32),

                    // SPPG details
                    _buildSectionHeader('🍳 DAPUR & QC PELAKSANA'),
                    const SizedBox(height: 12),
                    _buildDetailsGrid([
                      {'label': 'Dapur SPPG', 'val': cert['kitchen']},
                      {'label': 'Koki Utama', 'val': cert['chef']},
                      {'label': 'Selesai Masak', 'val': cert['cookTime']},
                      {'label': 'Batas Konsumsi', 'val': cert['safeTimeLimit'], 'color': Colors.red[700]},
                    ]),

                    const Divider(height: 32),

                    // Farmer Sourcing details
                    _buildSectionHeader('🚜 KETERTELUSURAN BAHAN BAKU (SOURCING)'),
                    const SizedBox(height: 12),
                    ...List.generate(cert['sourcing'].length, (index) {
                      final item = cert['sourcing'][index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey[100]!),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.agriculture_rounded, color: Color(0xFF0EA5E9), size: 20),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item['ing'],
                                    style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Dipasok dari: ${item['farm']}',
                                    style: TextStyle(fontSize: 10.5, color: Colors.grey[500], fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    }),

                    const Divider(height: 32),

                    // Nutrition facts
                    _buildSectionHeader('📊 KANDUNGAN NUTRISI MAKANAN'),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildNutriItem('${cert['calorie']}\nkkal', 'Kalori'),
                        _buildNutriItem('${cert['protein']}g', 'Protein'),
                        _buildNutriItem('${cert['carb']}g', 'Karbo'),
                        _buildNutriItem('${cert['fat']}g', 'Lemak'),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFFBEB),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFFEF3C7)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.info_outline, color: Color(0xFFD97706), size: 16),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Info Alergen: mengandung ${cert['allergens']}',
                              style: const TextStyle(fontSize: 10, color: Color(0xFF92400E), fontWeight: FontWeight.w700),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const Divider(height: 32),

                    // Ratings Corner
                    _buildSectionHeader('⭐ BERI SUARA ANDA (ULASAN ORANG TUA)'),
                    const SizedBox(height: 12),
                    if (_sent) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: const Color(0xFFD1FAE5),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          '✓ Ulasan Anda terkirim secara transparan!',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w900, color: Color(0xFF065F46)),
                        ),
                      ),
                    ] else ...[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(5, (index) {
                          double starVal = (index + 1).toDouble();
                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                _localRating = starVal;
                              });
                            },
                            child: Icon(
                              Icons.star_rounded,
                              color: starVal <= _localRating ? const Color(0xFFF59E0B) : Colors.grey[200],
                              size: 28,
                            ),
                          );
                        }),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _feedbackController,
                        decoration: InputDecoration(
                          hintText: 'Tulis komentar (anonim)...',
                          hintStyle: TextStyle(fontSize: 11.5, color: Colors.grey[400]),
                          fillColor: const Color(0xFFF8FAFC),
                          filled: true,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.all(12),
                        ),
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: () {
                          if (_feedbackController.text.trim().isEmpty) return;
                          setState(() {
                            _sent = true;
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0EA5E9),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: 0,
                        ),
                        child: const Text('Kirim Masukan', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            OutlinedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFF0EA5E9), width: 1.5),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: const Text(
                'Scan Box Makanan Lain',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF0EA5E9)),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.w900,
        color: Colors.grey,
        letterSpacing: 1.0,
      ),
    );
  }

  Widget _buildDetailsGrid(List<Map<String, dynamic>> items) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(14),
      ),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 2.8,
        ),
        itemCount: items.length,
        itemBuilder: (context, index) {
          final item = items[index];
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item['label'],
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey[400]),
              ),
              const SizedBox(height: 2),
              Text(
                item['val'],
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: item['color'] ?? const Color(0xFF0F172A),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildNutriItem(String val, String label) {
    return Container(
      width: 70,
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            val,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF0F172A), height: 1.2),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey[400]),
          ),
        ],
      ),
    );
  }
}
