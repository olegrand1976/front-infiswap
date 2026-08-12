import '../models/replacement_candidate.dart';

abstract final class ReplacementCandidateMapper {
  static ReplacementCandidate fromJson(
    Map<String, dynamic> json, {
    required String storageBaseUrl,
  }) {
    final respondent = _asMap(json['respondent']) ?? {};
    final status = json['status']?.toString() ?? 'pending';
    final canViewContact = json['can_view_respondent_contact'] == true;

    final name = respondent['full_name']?.toString().trim();
    final institutionName = respondent['name']?.toString().trim();

    return ReplacementCandidate(
      responseId: _parseInt(json['id']) ?? 0,
      status: status,
      statusLabel: replacementCandidateStatusLabel(status),
      respondentName: (name != null && name.isNotEmpty)
          ? name
          : (institutionName != null && institutionName.isNotEmpty)
              ? institutionName
              : 'Candidat',
      canViewContact: canViewContact,
      respondentAvatarUrl: _resolveStorageUrl(
        (respondent['profil_url'] ?? respondent['logo'])?.toString(),
        storageBaseUrl,
      ),
      respondentCity: respondent['city']?.toString(),
      respondentZipCode: respondent['zip_code']?.toString(),
      respondentPhone: respondent['phone_number']?.toString(),
      respondentEmail: respondent['email']?.toString(),
      identifierNumber: respondent['identifier_number']?.toString(),
      distanceKm: _parseDouble(json['distance_km']),
      comment: json['comment']?.toString().trim(),
      respondedAt: DateTime.tryParse(json['created_at']?.toString() ?? ''),
      bio: json['bio']?.toString().trim(),
      skills: _parseSkills(json['skills']),
      availability: json['availability']?.toString(),
      memberSince: DateTime.tryParse(json['member_since']?.toString() ?? ''),
      completedReplacementsCount: _parseInt(json['completed_replacements_count']),
      isVerified: json['is_verified'] == true,
    );
  }

  static List<String> _parseSkills(Object? raw) {
    if (raw is! List) {
      return const [];
    }
    return raw
        .map((item) => item.toString().trim())
        .where((item) => item.isNotEmpty)
        .toList();
  }

  static Map<String, dynamic>? _asMap(Object? value) {
    if (value is Map) {
      return value.map((key, val) => MapEntry(key.toString(), val));
    }
    return null;
  }

  static int? _parseInt(Object? value) {
    if (value is int) return value;
    if (value is String) return int.tryParse(value);
    return null;
  }

  static double? _parseDouble(Object? value) {
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }

  static String? _resolveStorageUrl(String? path, String storageBaseUrl) {
    var value = path?.trim();
    if (value == null || value.isEmpty) {
      return null;
    }

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
}
