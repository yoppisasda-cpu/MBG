import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/mbg_provider.dart';

class UlasTab extends StatefulWidget {
  const UlasTab({super.key});

  @override
  State<UlasTab> createState() => _UlasTabState();
}

class _UlasTabState extends State<UlasTab> {
  final TextEditingController _commentController = TextEditingController();
  double _localRating = 5.0;

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

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
            if (provider.schoolReviewed) ...[
              // Success Feedback Screen
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey[200]!, width: 1.5),
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.emoji_emotions_rounded,
                      color: Color(0xFFF59E0B),
                      size: 56,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Ulasan Terkirim Transparan!',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Terima kasih telah berkontribusi menjaga standar mutu masakan harian program MBG.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[500],
                        fontWeight: FontWeight.w500,
                        height: 1.4,
                      ),
                    ),
                    const Divider(height: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (index) {
                        return Icon(
                          Icons.star_rounded,
                          color: index < provider.schoolRating
                              ? const Color(0xFFF59E0B)
                              : Colors.grey[200],
                          size: 24,
                        );
                      }),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '"${provider.schoolComment}"',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[700],
                        fontStyle: FontStyle.italic,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ] else ...[
              // Rating Input Form
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
                      const Text(
                        'EVALUASI MUTU GIZI & RASA',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: Colors.grey,
                          letterSpacing: 1.1,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Interactive Star Row
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
                              color: starVal <= _localRating
                                  ? const Color(0xFFF59E0B)
                                  : Colors.grey[200],
                              size: 40,
                            ),
                          );
                        }),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Skor Penilaian: $_localRating/5.0',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Comment Area Card
              Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: Colors.grey[200]!, width: 1.5),
                ),
                color: Colors.white,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: TextField(
                    controller: _commentController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: 'Berikan masukan (contoh: rasa ayam bakar pas, sayur wortel dipotong pas untuk anak, porsi nasi kenyang)',
                      hintStyle: TextStyle(fontSize: 12, color: Colors.grey[400]),
                      border: InputBorder.none,
                    ),
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: () {
                  if (_commentController.text.trim().isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Silakan tulis ulasan terlebih dahulu.'),
                        backgroundColor: Color(0xFFEF4444),
                      ),
                    );
                    return;
                  }
                  provider.submitReview(_localRating, _commentController.text);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF59E0B),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                ),
                child: const Text(
                  'Kirim Ulasan Masakan',
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
