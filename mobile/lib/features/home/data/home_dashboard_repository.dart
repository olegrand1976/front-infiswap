import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/user_activity_stats.dart';

class HomeDashboardRepository {
  HomeDashboardRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  Future<UserActivityStats> fetch() async {
    try {
      final response = await _api.get<Map<String, dynamic>>('/reports');
      final replacement = response.data?['replacement'];
      if (replacement is Map<String, dynamic>) {
        return UserActivityStats.fromJson(replacement);
      }
      if (replacement is Map) {
        return UserActivityStats.fromJson(
          replacement.map((key, value) => MapEntry(key.toString(), value)),
        );
      }
    } catch (_) {
      // Fallback: null counts displayed as "—"
    }

    return const UserActivityStats();
  }
}

final homeDashboardRepositoryProvider = Provider<HomeDashboardRepository>((ref) {
  return HomeDashboardRepository(apiClient: ref.watch(apiClientProvider));
});
