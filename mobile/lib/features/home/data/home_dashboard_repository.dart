import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../replacements/data/replacements_repository.dart';
import '../../replacements/models/replacement_item.dart';
import '../../replacements/models/replacement_search_params.dart';
import '../models/home_dashboard_data.dart';
import '../models/user_activity_stats.dart';

class HomeDashboardRepository {
  HomeDashboardRepository({
    required ApiClient apiClient,
    required ReplacementsRepository replacementsRepository,
  })  : _api = apiClient,
        _replacements = replacementsRepository;

  final ApiClient _api;
  final ReplacementsRepository _replacements;

  Future<HomeDashboardData> fetch(int userId) async {
    final statsFuture = _fetchActivity(userId);
    final recentFuture = _replacements.fetchMergedList(
      const ReplacementSearchParams(perPage: 5),
    );

    final results = await Future.wait<Object>([statsFuture, recentFuture]);

    return HomeDashboardData(
      stats: results[0] as UserActivityStats,
      recentReplacements: results[1] as List<ReplacementItem>,
    );
  }

  Future<UserActivityStats> _fetchActivity(int userId) async {
    try {
      final response = await _api.get<Map<String, dynamic>>(
        '/replacements/$userId/activity',
      );
      final activity = response.data?['activity'];
      if (activity is Map<String, dynamic>) {
        return UserActivityStats.fromJson(activity);
      }
      if (activity is Map) {
        return UserActivityStats.fromJson(
          activity.map((key, value) => MapEntry(key.toString(), value)),
        );
      }
    } catch (_) {
      // Fallback: null counts displayed as "—"
    }

    return const UserActivityStats();
  }
}

final homeDashboardRepositoryProvider = Provider<HomeDashboardRepository>((ref) {
  return HomeDashboardRepository(
    apiClient: ref.watch(apiClientProvider),
    replacementsRepository: ref.watch(replacementsRepositoryProvider),
  );
});
