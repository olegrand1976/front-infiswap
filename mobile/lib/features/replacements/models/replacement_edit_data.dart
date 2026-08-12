import 'dart:convert';

import 'create_replacement_payload.dart';

/// Raw, editable snapshot of a posted replacement, as returned by
/// `GET /replacements/{id}`. Used to prefill [EditReplacementScreen].
class ReplacementEditData {
  const ReplacementEditData({
    required this.id,
    required this.userId,
    required this.visibility,
    required this.status,
    required this.type,
    required this.experienceYears,
    required this.patientCount,
    required this.zipCodes,
    required this.cities,
    required this.careTypeIds,
    required this.country,
    required this.comment,
    required this.periods,
    required this.morning,
    required this.evening,
  });

  final int id;
  final int userId;
  final String visibility;
  final String status;
  final String type;
  final Object? experienceYears;
  final String patientCount;
  final List<String> zipCodes;
  final List<String> cities;
  final List<int> careTypeIds;
  final String country;
  final String comment;
  final List<ReplacementPeriodInput> periods;
  final TimeSlotRange morning;
  final TimeSlotRange evening;

  factory ReplacementEditData.fromJson(Map<String, dynamic> json) {
    final timeSlot = _asMap(_parseMaybeJson(json['timeSlot'])) ??
        _asMap(_parseMaybeJson(json['time_slot'])) ??
        const {};
    final morningSlot = _asMap(timeSlot['morning']) ?? const {};
    final eveningSlot = _asMap(timeSlot['evening']) ?? const {};

    final rawPeriods = json['periods'];
    final periods = rawPeriods is List && rawPeriods.isNotEmpty
        ? rawPeriods
            .map((p) => _asMap(p) ?? const {})
            .map(
              (p) => ReplacementPeriodInput(
                startDate: DateTime.tryParse(
                        p['start_date']?.toString() ?? '') ??
                    DateTime.now(),
                endDate: DateTime.tryParse(p['end_date']?.toString() ?? '') ??
                    DateTime.now(),
              ),
            )
            .toList()
        : <ReplacementPeriodInput>[
            ReplacementPeriodInput(
              startDate:
                  DateTime.tryParse(json['start_date']?.toString() ?? '') ??
                      DateTime.now(),
              endDate:
                  DateTime.tryParse(json['end_date']?.toString() ?? '') ??
                      DateTime.now(),
            ),
          ];

    return ReplacementEditData(
      id: int.tryParse(json['id'].toString()) ?? 0,
      userId: int.tryParse(json['user_id'].toString()) ?? 0,
      visibility: json['visibility']?.toString() ?? '',
      status: json['status']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      experienceYears: json['experience_years'],
      patientCount: json['patient_count']?.toString() ?? '0',
      zipCodes: _normalizeStringList(json['zip_codes']),
      cities: _normalizeStringList(json['cities']),
      careTypeIds: _careTypeIds(json['care_types']),
      country: json['country']?.toString() ?? 'be',
      comment: json['comment']?.toString() ?? '',
      periods: periods,
      morning: TimeSlotRange(
        startAt: morningSlot['start_at']?.toString() ??
            morningSlot['startAt']?.toString(),
        endAt: morningSlot['end_at']?.toString() ??
            morningSlot['endAt']?.toString(),
      ),
      evening: TimeSlotRange(
        startAt: eveningSlot['start_at']?.toString() ??
            eveningSlot['startAt']?.toString(),
        endAt: eveningSlot['end_at']?.toString() ??
            eveningSlot['endAt']?.toString(),
      ),
    );
  }

  static List<int> _careTypeIds(Object? raw) {
    if (raw is! List) {
      return const [];
    }
    return raw
        .map((item) {
          if (item is Map) {
            return int.tryParse(item['id'].toString());
          }
          return int.tryParse(item.toString());
        })
        .whereType<int>()
        .toList();
  }

  static List<String> _normalizeStringList(Object? raw) {
    final decoded = raw is String ? _parseMaybeJson(raw) : raw;
    if (decoded is List) {
      return decoded.map((e) => e.toString()).toList();
    }
    return const [];
  }

  static Object? _parseMaybeJson(Object? raw) {
    if (raw is! String) {
      return raw;
    }
    final trimmed = raw.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return raw;
    }
    try {
      return jsonDecode(trimmed);
    } catch (_) {
      return raw;
    }
  }

  static Map<String, dynamic>? _asMap(Object? raw) {
    if (raw is Map<String, dynamic>) {
      return raw;
    }
    if (raw is Map) {
      return raw.map((key, value) => MapEntry(key.toString(), value));
    }
    return null;
  }
}
