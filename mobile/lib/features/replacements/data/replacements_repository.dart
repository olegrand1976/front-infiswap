import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/config/app_config.dart';
import '../models/dashboard_replacements_summary.dart';
import '../models/replacement_item.dart';
import '../models/replacement_search_params.dart';
import 'replacement_mapper.dart';

class ReplacementsRepository {
  ReplacementsRepository({
    required ApiClient apiClient,
    required AppConfig config,
  })  : _api = apiClient,
        _config = config;

  final ApiClient _api;
  final AppConfig _config;

  Future<List<ReplacementItem>> fetchMergedList(
    ReplacementSearchParams params,
  ) async {
    final page = await _fetchMergedPage(params.toApiBody());
    return page.items;
  }

  Future<List<ReplacementItem>> fetchMyReplacements() async {
    final page = await _fetchMergedPage({
      'type': 'me',
      'filters': {'type': 'all', 'role': 'all', 'status': 'all'},
      'days': <String>[],
      'cities': <String>[],
      'zipCodes': <String>[],
      'provinces': <String>[],
      'country': 'be',
      'page': 1,
      'perPage': 50,
      'groupByProvince': false,
    });
    return page.items;
  }

  Future<DashboardReplacementsSummary> fetchDashboardSummary() async {
    final pages = await Future.wait([
      _fetchMergedPage(_dashboardBody(type: 'other')),
      _fetchMergedPage(_dashboardBody(type: '')),
    ]);
    final replacementsPage = pages[0];
    final mergedPage = pages[1];

    final boosted =
        replacementsPage.items.where((item) => item.isBoosted).toList();
    final missions = mergedPage.items.where((item) => item.isMission).toList();
    final missionsTotal = mergedPage.total - replacementsPage.total;

    return DashboardReplacementsSummary(
      boostedReplacements: boosted,
      recentReplacements: replacementsPage.items,
      missions: missions,
      replacementsTotal: replacementsPage.total,
      missionsTotal: missionsTotal < 0 ? 0 : missionsTotal,
    );
  }

  Map<String, dynamic> _dashboardBody({required String type}) {
    return {
      'type': type,
      'filters': {'type': 'all', 'role': 'all', 'status': 'open'},
      'days': <String>[],
      'cities': <String>[],
      'zipCodes': <String>[],
      'provinces': <String>[],
      'country': 'be',
      'page': 1,
      'perPage': 50,
      'groupByProvince': false,
    };
  }

  Future<_MergedPage> _fetchMergedPage(Map<String, dynamic> body) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/replacements/search/merged',
      data: body,
    );

    final root = response.data ?? {};
    final replacements = root['replacements'];
    if (replacements is! Map) {
      throw ApiException(message: 'Réponse liste invalide.');
    }

    final data = replacements['data'];
    final items = data is List
        ? data
            .whereType<Map>()
            .map(
              (item) => ReplacementMapper.fromMergedJson(
                item.map((key, value) => MapEntry(key.toString(), value)),
                storageBaseUrl: _config.apiBaseUrl,
              ),
            )
            .toList()
        : <ReplacementItem>[];

    final total =
        int.tryParse(replacements['total']?.toString() ?? '') ?? items.length;

    return _MergedPage(items: items, total: total);
  }
}

class _MergedPage {
  const _MergedPage({required this.items, required this.total});

  final List<ReplacementItem> items;
  final int total;
}

final replacementsRepositoryProvider = Provider<ReplacementsRepository>((ref) {
  return ReplacementsRepository(
    apiClient: ref.watch(apiClientProvider),
    config: ref.watch(appConfigProvider),
  );
});
