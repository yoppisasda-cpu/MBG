import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';

class MbgProvider with ChangeNotifier {
  // Active Role State
  String _activeRole = 'Sekolah'; // 'Sekolah', 'Kurir', 'Umum', 'Dapur'
  String get activeRole => _activeRole;

  void setActiveRole(String role) {
    _activeRole = role;
    notifyListeners();
  }

  // 🍳 Dapur SPPG State
  bool _hygieneChecked = false;
  bool get hygieneChecked => _hygieneChecked;

  void submitHygieneQC() {
    _hygieneChecked = true;
    notifyListeners();
  }

  void releaseMeal(String id) {
    final idx = _deliveries.indexWhere((d) => d['id'] == id);
    if (idx != -1) {
      _deliveries[idx]['status'] = 'Dalam Perjalanan';
      _deliveries[idx]['temp'] = '55°C';
      _deliveries[idx]['eta'] = '15 menit';
    }
    notifyListeners();
  }

  // 🙋 Relawan (Volunteer) State
  bool _volunteerClockedIn = false;
  bool get volunteerClockedIn => _volunteerClockedIn;

  String _volunteerTimeIn = '';
  String get volunteerTimeIn => _volunteerTimeIn;

  File? _volunteerPhoto;
  File? get volunteerPhoto => _volunteerPhoto;

  String _volunteerCoordinates = '';
  String get volunteerCoordinates => _volunteerCoordinates;

  void clockInVolunteer(File photo, String coords) {
    _volunteerClockedIn = true;
    _volunteerPhoto = photo;
    _volunteerCoordinates = coords;
    
    final now = DateTime.now();
    _volunteerTimeIn = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')} WIB';
    
    notifyListeners();
  }

  void clockOutVolunteer() {
    _volunteerClockedIn = false;
    _volunteerTimeIn = '';
    _volunteerPhoto = null;
    _volunteerCoordinates = '';
    notifyListeners();
  }

  final List<Map<String, dynamic>> _volunteerTasks = [
    {
      'id': 't1',
      'title': 'Bantu Packing Makanan di SPPG Melati',
      'time': '07:00 - 08:30 WIB',
      'isDone': true,
    },
    {
      'id': 't2',
      'title': 'Pendampingan Pembagian Porsi di SDN 01 Kebayoran Lama',
      'time': '09:30 - 11:30 WIB',
      'isDone': false,
    },
    {
      'id': 't3',
      'title': 'Edukasi Gizi & Cuci Tangan Sebelum Makan ke Siswa Kelas 1',
      'time': '10:00 - 10:30 WIB',
      'isDone': false,
    }
  ];

  List<Map<String, dynamic>> get volunteerTasks => _volunteerTasks;

  void toggleVolunteerTask(String id) {
    final idx = _volunteerTasks.indexWhere((t) => t['id'] == id);
    if (idx != -1) {
      _volunteerTasks[idx]['isDone'] = !_volunteerTasks[idx]['isDone'];
    }
    notifyListeners();
  }

  // 🏫 School Coordinator State
  int _studentsCount = 120;
  int get studentsCount => _studentsCount;

  int _originalCount = 120;
  int get originalCount => _originalCount;

  bool _attendanceSubmitted = false;
  bool get attendanceSubmitted => _attendanceSubmitted;

  bool _deliveryVerified = false;
  bool get deliveryVerified => _deliveryVerified;

  bool _schoolReviewed = false;
  bool get schoolReviewed => _schoolReviewed;

  double _schoolRating = 5.0;
  double get schoolRating => _schoolRating;

  String _schoolComment = '';
  String get schoolComment => _schoolComment;

  void updateStudentsCount(int count) {
    _studentsCount = count;
    // Update target porsi in courier list as well for perfect local sync
    final idx = _deliveries.indexWhere((d) => d['id'] == 'd1');
    if (idx != -1) {
      _deliveries[idx]['porsi'] = count;
    }
    notifyListeners();
  }

  void submitAttendance() {
    _attendanceSubmitted = true;
    notifyListeners();
  }

  void verifyDelivery() {
    _deliveryVerified = true;
    final idx = _deliveries.indexWhere((d) => d['id'] == 'd1');
    if (idx != -1) {
      _deliveries[idx]['status'] = 'Selesai';
      _deliveries[idx]['timeCompleted'] = '08:45 WIB';
    }
    notifyListeners();
  }

  void submitReview(double rating, String comment) {
    _schoolRating = rating;
    _schoolComment = comment;
    _schoolReviewed = true;
    notifyListeners();
  }

  // 🛵 Courier Logistics State
  String _activeDeliveryId = 'd1';
  String get activeDeliveryId => _activeDeliveryId;

  double _transitProgress = 0.0;
  double get transitProgress => _transitProgress;

  bool _isSimulating = false;
  bool get isSimulating => _isSimulating;

  String _currentCoordinates = '-6.22970, 106.79780';
  String get currentCoordinates => _currentCoordinates;

  final List<Map<String, dynamic>> _deliveries = [
    {
      'id': 'd1',
      'schoolName': 'SDN 01 Kebayoran Lama',
      'porsi': 120,
      'status': 'Dalam Perjalanan', // 'Menunggu Dapur', 'Dalam Perjalanan', 'Selesai'
      'courier': 'Joko Prabowo',
      'temp': '55°C',
      'eta': '5 menit',
      'timeCompleted': '',
    },
    {
      'id': 'd2',
      'schoolName': 'SMPN 12 Jakarta Selatan',
      'porsi': 180,
      'status': 'Menunggu Dapur',
      'courier': 'Joko Prabowo',
      'temp': '--',
      'eta': '--',
      'timeCompleted': '',
    }
  ];

  List<Map<String, dynamic>> get deliveries => _deliveries;

  Map<String, dynamic> get activeDelivery =>
      _deliveries.firstWhere((d) => d['id'] == _activeDeliveryId, orElse: () => _deliveries[0]);

  void setActiveDeliveryId(String id) {
    _activeDeliveryId = id;
    _transitProgress = activeDelivery['status'] == 'Selesai' ? 100.0 : 0.0;
    _isSimulating = false;
    notifyListeners();
  }

  void startGpsSimulation() {
    if (activeDelivery['status'] == 'Menunggu Dapur') {
      return;
    }
    _transitProgress = 0.0;
    _isSimulating = true;
    notifyListeners();

    Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (_transitProgress >= 100.0) {
        _isSimulating = false;
        timer.cancel();
        notifyListeners();
      } else {
        _transitProgress += 10.0;
        
        // Simulate changing coordinates from Kebayoran Baru to Kebayoran Lama
        double startLat = -6.2297;
        double startLng = 106.7978;
        double endLat = -6.2442;
        double endLng = 106.7725;

        double curLat = startLat + (endLat - startLat) * (_transitProgress / 100.0);
        double curLng = startLng + (endLng - startLng) * (_transitProgress / 100.0);
        
        _currentCoordinates = '${curLat.toStringAsFixed(5)}, ${curLng.toStringAsFixed(5)}';
        notifyListeners();
      }
    });
  }

  // 🚜 Public Portal & Sourcing State
  final Map<String, dynamic> _foodCertificate = {
    'menuName': 'Nasi Kuning Premium & Ayam Bakar Madu',
    'calorie': 480,
    'protein': 29,
    'fat': 12,
    'carb': 64,
    'allergens': 'Kedelai, Wijen',
    'kitchen': 'SPPG Melati Kebayoran',
    'chef': 'Chef Budi Santoso',
    'cookTime': '06:15 WIB',
    'safeTimeLimit': '10:15 WIB (Maks. 4 jam setelah masak)',
    'sourcing': [
      {'ing': 'Beras Pandan Wangi', 'farm': 'Kelompok Tani Makmur (Cianjur)'},
      {'ing': 'Ayam Fillet Segar', 'farm': 'Peternakan Rakyat Berkah Sejahtera'},
      {'ing': 'Sayur Wortel & Buncis', 'farm': 'Koperasi Sayur Organik Cipanas'}
    ]
  };

  Map<String, dynamic> get foodCertificate => _foodCertificate;
}
