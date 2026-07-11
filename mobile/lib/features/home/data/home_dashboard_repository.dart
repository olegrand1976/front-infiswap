import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/config/app_config.dart';
import '../../replacements/data/replacements_repository.dart';
import '../../replacements/models/replacement_search_params.dart';
import '../models/home_dashboard_data.dart';

class HomeDashboardRepository {
  HomeDashboardRepository({
    required ApiClient apiClient,
    required ReplacementsRepository replacementsRepository,
  })  : _api = apiClient,
        _replacements = replacementsRepository;

  final ApiClient _api;
  final ReplacementsRepository _replacements;

  Future<HomeDashboardData> fetch(int userId) async {
    final statsFuture = _fetchStats(userId);
    final recentFuture = _replacements.fetchMergedList(
      const ReplacementSearchParams(perPage: 5),
    );

    final results = await Future.wait([statsFuture, recentFuture]);

    return HomeDashboardData(
      stats: results[0] as HomeStats,
      recentReplacements: results[1] as List,
    );
  }

  Future<HomeStats> _fetchStats(int userId) async {
    int? applicationsCount;
    int? acceptedCount;
    int? createdCount;

    try {
      final response = await _api.get<Map<String, dynamic>>(
        '/replacement-responses/applied/$userId',
      );
      final data = response.data?['data'];
      if (data is List) {
        applicationsCount = data.length;
        acceptedCount = data.where((item) {
          if (item is! Map) {
            return false;
          }
          final responseMap = item['response'];
          if (responseMap is! Map) {
            return false;
          }
          final status = responseMap['status']?.toString();
          return status == 'confirmed' || status == 'chat_enabled';
        }).length;
      }
    } catch (_) {
      // Fallback: null count displayed as "—"
    }

    try {
      final response = await _api.get<Map<String, dynamic>>(
        '/replacements/me',
        queryParameters: {'perPage': 1, 'page': 1},
      );
      final replacements = response.data?['replacements'];
      if (replacements is Map) {
        final total = replacements['total'];
        if (total is int) {
          createdCount = total;
        } else if (total is String) {
          createdCount = int.tryParse(total);
        }
      }
    } catch (_) {
      // Fallback: null count displayed as "—"
    }

    return HomeStats(
      applicationsCount: applicationsCount,
      acceptedCount: acceptedCount,
      createdCount: createdCount,
    );
  }
}

final homeDashboardRepositoryProvider = Provider<HomeDashboardRepository>((ref) {
  return HomeDashboardRepository(
    apiClient: ref.watch(apiClientProvider),
    replacementsRepository: ref.watch(replacementsRepositoryProvider),
  );
});
