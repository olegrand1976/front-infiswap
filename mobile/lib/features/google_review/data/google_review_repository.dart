import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';

const googleReviewUrl = 'https://g.page/r/Cf8HfnS8YUz2EAE/review';
const googleReviewSettingKey = 'google_review';

Map<String, dynamic> parseUserSettings(Map<String, dynamic> user) {
  final raw = user['settings'];
  if (raw is Map) {
    return raw.cast<String, dynamic>();
  }
  if (raw is String && raw.isNotEmpty) {
    try {
      final decoded = jsonDecode(raw);
      if (decoded is Map) return decoded.cast<String, dynamic>();
    } catch (_) {}
  }
  return {};
}

bool hasLeftGoogleReview(Map<String, dynamic> user) {
  final setting = parseUserSettings(user)[googleReviewSettingKey];
  if (setting is! Map) return false;
  final leftAt = setting['left_at'];
  return leftAt is String && leftAt.trim().isNotEmpty;
}

Map<String, dynamic> withGoogleReviewLeft(
  Map<String, dynamic> user,
  Map<String, dynamic> value,
) {
  final settings = parseUserSettings(user);
  return {
    ...user,
    'settings': jsonEncode({...settings, googleReviewSettingKey: value}),
  };
}

class GoogleReviewRepository {
  GoogleReviewRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  Future<Map<String, dynamic>> markLeft(String source) async {
    final value = {
      'left_at': DateTime.now().toUtc().toIso8601String(),
      'source': source,
    };
    await _api.post<Map<String, dynamic>>(
      '/users/settings',
      data: {'key': googleReviewSettingKey, 'value': value},
    );
    return value;
  }
}

final googleReviewRepositoryProvider = Provider<GoogleReviewRepository>((ref) {
  return GoogleReviewRepository(apiClient: ref.watch(apiClientProvider));
});
