import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/mbg_provider.dart';

class TugasTab extends StatelessWidget {
  const TugasTab({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MbgProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'DAFTAR TUGAS RELAWAN HARI INI:',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: Colors.grey[400],
                letterSpacing: 1.1,
              ),
            ),
            const SizedBox(height: 12),

            Expanded(
              child: ListView.builder(
                itemCount: provider.volunteerTasks.length,
                itemBuilder: (context, index) {
                  final task = provider.volunteerTasks[index];
                  final bool isDone = task['isDone'];

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDone ? Colors.white.withOpacity(0.8) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDone ? const Color(0xFFFFE4E6) : Colors.grey[200]!,
                        width: 1.5,
                      ),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                task['title'],
                                style: TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w800,
                                  color: isDone ? Colors.grey[400] : const Color(0xFF0F172A),
                                  decoration: isDone ? TextDecoration.lineThrough : null,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Icon(Icons.schedule_rounded, color: isDone ? Colors.grey[300]! : const Color(0xFFF43F5E), size: 13),
                                  const SizedBox(width: 6),
                                  Text(
                                    task['time'],
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: isDone ? Colors.grey[400] : Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Checkbox(
                          value: isDone,
                          onChanged: (val) {
                            provider.toggleVolunteerTask(task['id']);
                          },
                          activeColor: const Color(0xFFF43F5E),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
