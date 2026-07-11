import 'dart:convert';

import '../models/replacement_item.dart';

abstract final class ReplacementMapper {
  static ReplacementItem fromMergedJson(
    Map<String, dynamic> json, {
    required String storageBaseUrl,
  }) {
    final recordType = json['record_type']?.toString();
    if (recordType == 'mission') {
      return _fromMission(json, storageBaseUrl: storageBaseUrl);
    }
    return _fromReplacement(json);
  }

  static ReplacementItem fromReplacementJson(Map<String, dynamic> json) {
    return _fromReplacement(json);
  }

  static ReplacementItem _fromReplacement(Map<String, dynamic> json) {
    final zipCodes = _normalizeStringList(json['zip_codes']);
    final cities = _normalizeStringList(json['cities']);

    final periods = _mapReplacementPeriods(json);
    final careTypes = _careTypeNames(json['care_types']);
    final role = _roleLabel(json['role_type'] ?? json['replacement_type']);
    final comment = json['comment']?.toString().trim();

    final dateLabel = periods.isNotEmpty
        ? periods.first.dateLabel
        : _formatDateRange(
            json['start_date']?.toString(),
            json['end_date']?.toString(),
          );

    return ReplacementItem(
      id: json['id'].toString(),
      zipCodes: zipCodes,
      cities: cities,
      dateLabel: dateLabel,
      title: 'Remplacement $role',
      subtitle: [
        role,
        if (careTypes.isNotEmpty) careTypes.first,
      ].join(' · '),
      role: role,
      description: comment ?? '',
      careTypes: careTypes,
      periods: periods,
      isUrgent: json['type']?.toString() == 'immediate',
      isBoosted: _isActivelyBoosted(json),
      isMission: false,
    );
  }

  static ReplacementItem _fromMission(
    Map<String, dynamic> json, {
    required String storageBaseUrl,
  }) {
    final institution = _asMap(json['institution']);
    final service = _asMap(json['service']);

    final zip = institution?['zip_code']?.toString();
    final city = institution?['city']?.toString();
    final zipCodes = zip != null && zip.isNotEmpty ? [zip] : const <String>[];
    final cities = city != null && city.isNotEmpty ? [city] : const <String>[];

    final serviceName = service?['name']?.toString();
    final diploma = json['required_diploma']?.toString();
    final description = json['description']?.toString().trim();

    final morning = _formatTimeRange(
      json['morning_start_at']?.toString(),
      json['morning_end_at']?.toString(),
    );
    final evening = _formatTimeRange(
      json['afternoon_start_at']?.toString() ??
          json['time_start_at']?.toString(),
      json['afternoon_end_at']?.toString() ?? json['time_end_at']?.toString(),
    );

    final start = json['start_date']?.toString();
    final end = json['end_date']?.toString();

    final institutionName = institution?['institution_name']?.toString() ??
        institution?['name']?.toString();

    final logoPath = institution?['logo']?.toString() ??
        institution?['profil_url']?.toString();

    return ReplacementItem(
      id: 'mission-${json['id']}',
      zipCodes: zipCodes,
      cities: cities,
      dateLabel: _formatDateRange(start, end),
      title: institutionName?.isNotEmpty == true
          ? institutionName!
          : (serviceName?.isNotEmpty == true
              ? serviceName!
              : 'Mission institution'),
      subtitle: [
        if (diploma != null && diploma.isNotEmpty) diploma,
        if (serviceName != null && serviceName.isNotEmpty) serviceName,
      ].join(' · '),
      role: diploma?.isNotEmpty == true ? diploma! : 'Infirmier',
      description: description ?? '',
      careTypes: serviceName != null && serviceName.isNotEmpty
          ? [serviceName]
          : const <String>[],
      periods: [
        ReplacementPeriod(
          dateLabel: _formatDateRange(start, end),
          morning: morning,
          evening: evening,
        ),
      ],
      isUrgent: false,
      isBoosted: false,
      isMission: true,
      institutionName: institutionName,
      institutionLogoUrl: _resolveStorageUrl(logoPath, storageBaseUrl),
    );
  }

  static String? _resolveStorageUrl(String? path, String storageBaseUrl) {
    var value = path?.trim();
    if (value == null || value.isEmpty) {
      return null;
    }

    // Certains payloads gardent des backslashes JSON.
    value = value.replaceAll('\\', '/');

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    final normalized = value.startsWith('/') ? value.substring(1) : value;
    final withoutStorage = normalized.startsWith('storage/')
        ? normalized.substring('storage/'.length)
        : normalized;

    final base = storageBaseUrl.endsWith('/')
        ? storageBaseUrl.substring(0, storageBaseUrl.length - 1)
        : storageBaseUrl;

    return '$base/storage/$withoutStorage';
  }

  static bool _isActivelyBoosted(Map<String, dynamic> json) {
    if (json['is_boosted'] != true) {
      return false;
    }
    final until = json['boosted_until']?.toString();
    if (until == null || until.isEmpty) {
      return true;
    }
    final date = DateTime.tryParse(until);
    if (date == null) {
      return true;
    }
    return date.isAfter(DateTime.now());
  }

  static List<ReplacementPeriod> _mapReplacementPeriods(
    Map<String, dynamic> json,
  ) {
    final rawPeriods = json['periods'];
    final timeSlot = _parseMaybeJsonMap(json['timeSlot']) ??
        _parseMaybeJsonMap(json['time_slot']);
    final morningSlot = _asMap(timeSlot?['morning']);
    final eveningSlot = _asMap(timeSlot?['evening']);

    final morning = _formatTimeRange(
      morningSlot?['start_at']?.toString() ??
          morningSlot?['startAt']?.toString() ??
          timeSlot?['start_at']?.toString(),
      morningSlot?['end_at']?.toString() ??
          morningSlot?['endAt']?.toString() ??
          timeSlot?['end_at']?.toString(),
    );
    final evening = _formatTimeRange(
      eveningSlot?['start_at']?.toString() ??
          eveningSlot?['startAt']?.toString(),
      eveningSlot?['end_at']?.toString() ?? eveningSlot?['endAt']?.toString(),
    );

    if (rawPeriods is List && rawPeriods.isNotEmpty) {
      return rawPeriods.map((period) {
        final map = _asMap(period) ?? {};
        return ReplacementPeriod(
          dateLabel: _formatDateRange(
            map['start_date']?.toString(),
            map['end_date']?.toString(),
          ),
          morning: morning,
          evening: evening,
        );
      }).toList();
    }

    final details = json['details'];
    if (details is List && details.isNotEmpty) {
      return details.map((detail) {
        final map = _asMap(detail) ?? {};
        return ReplacementPeriod(
          dateLabel: _formatDate(map['date']?.toString()),
          morning: _formatTimeRange(
            map['start_at']?.toString(),
            map['end_at']?.toString(),
          ),
        );
      }).toList();
    }

    return [
      ReplacementPeriod(
        dateLabel: _formatDateRange(
          json['start_date']?.toString(),
          json['end_date']?.toString(),
        ),
        morning: morning,
        evening: evening,
      ),
    ];
  }

  static String _roleLabel(Object? raw) {
    switch (raw?.toString()) {
      case 'nurse':
        return 'Infirmier';
      case 'caregiver':
        return 'Aide-soignant';
      case 'midwife':
        return 'Sage-femme';
      default:
        return 'Infirmier';
    }
  }

  static List<String> _careTypeNames(Object? raw) {
    if (raw is! List) {
      return const [];
    }
    return raw
        .map((item) {
          if (item is String) {
            return item;
          }
          if (item is Map) {
            return item['name']?.toString() ?? '';
          }
          return '';
        })
        .where((name) => name.isNotEmpty)
        .toList();
  }

  /// Parse zip_codes / cities même si l'API renvoie une string JSON ou CSV.
  static List<String> _normalizeStringList(Object? raw) {
    final values = <String>[];

    void addToken(String value) {
      final trimmed = value.trim();
      if (trimmed.isEmpty) {
        return;
      }
      if (trimmed.contains(',')) {
        for (final part in trimmed.split(',')) {
          final p = part.trim();
          if (p.isNotEmpty && !values.contains(p)) {
            values.add(p);
          }
        }
        return;
      }
      if (!values.contains(trimmed)) {
        values.add(trimmed);
      }
    }

    if (raw == null) {
      return values;
    }

    if (raw is List) {
      for (final item in raw) {
        addToken(item.toString());
      }
      return values;
    }

    if (raw is String) {
      final text = raw.trim();
      if (text.isEmpty) {
        return values;
      }
      if (text.startsWith('[')) {
        try {
          final decoded = jsonDecode(text);
          if (decoded is List) {
            for (final item in decoded) {
              addToken(item.toString());
            }
            return values;
          }
        } catch (_) {
          // fallback below
        }
      }
      addToken(text);
    }

    return values;
  }

  static String _formatDateRange(String? start, String? end) {
    final startLabel = _formatDate(start);
    final endLabel = _formatDate(end);
    if (startLabel.isEmpty) {
      return 'Date non précisée';
    }
    if (endLabel.isEmpty || endLabel == startLabel) {
      return startLabel;
    }
    return '$startLabel – $endLabel';
  }

  static String _formatDate(String? raw) {
    if (raw == null || raw.isEmpty) {
      return '';
    }
    final date = DateTime.tryParse(raw);
    if (date == null) {
      return raw;
    }
    const months = [
      'janv.',
      'févr.',
      'mars',
      'avr.',
      'mai',
      'juin',
      'juil.',
      'août',
      'sept.',
      'oct.',
      'nov.',
      'déc.',
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  static String? _formatTimeRange(String? start, String? end) {
    if (start == null || start.isEmpty || start == 'null') {
      return null;
    }
    if (end == null || end.isEmpty || end == 'null') {
      return start;
    }
    return '$start – $end';
  }

  static Map<String, dynamic>? _parseMaybeJsonMap(Object? raw) {
    if (raw is Map) {
      return _asMap(raw);
    }
    if (raw is String && raw.trim().startsWith('{')) {
      try {
        final decoded = jsonDecode(raw);
        return _asMap(decoded);
      } catch (_) {
        return null;
      }
    }
    return null;
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
