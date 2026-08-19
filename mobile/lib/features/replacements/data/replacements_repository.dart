import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/config/app_config.dart';
import '../models/replacement_candidate.dart';
import '../models/replacement_item.dart';
import '../models/replacement_search_params.dart';
import 'replacement_candidate_mapper.dart';
import 'replacement_mapper.dart';

class ReplacementsRepository {
  ReplacementsRepository({
    required ApiClient apiClient,
    required AppConfig config,
  })  : _api = apiClient,
        _config = config;

  final ApiClient _api;
  final AppConfig _config;

  Future<ReplacementSearchPage> fetchSearchPage(
    ReplacementSearchParams params,
  ) {
    return _fetchMergedPage(params.toApiBody());
  }

  Future<ReplacementSearchPage> fetchMyReplacements({
    int page = 1,
    int perPage = 25,
  }) {
    return _fetchMergedPage({
      'type': 'me',
      'filters': {'type': 'all', 'role': 'all', 'status': 'all'},
      'days': <String>[],
      'cities': <String>[],
      'zipCodes': <String>[],
      'provinces': <String>[],
      'country': 'be',
      'page': page,
      'perPage': perPage,
      'groupByProvince': false,
    });
  }

  Future<ReplacementItem> fetchById(int id) async {
    final response = await _api.get<Map<String, dynamic>>('/replacements/$id');
    final data = response.data?['replacement'];
    if (data is! Map) {
      throw ApiException(message: 'Remplacement introuvable.');
    }

    return ReplacementMapper.fromMergedJson(
      data.map((key, value) => MapEntry(key.toString(), value)),
      storageBaseUrl: _config.apiBaseUrl,
    );
  }

  Future<List<ReplacementCandidate>> fetchCandidates(int replacementId) async {
    final response = await _api.get<Map<String, dynamic>>(
      '/replacement-responses/$replacementId',
    );

    final data = response.data?['responses'];
    if (data is! List) {
      return const [];
    }

    return data
        .whereType<Map>()
        .map(
          (item) => ReplacementCandidateMapper.fromJson(
            item.map((key, value) => MapEntry(key.toString(), value)),
            storageBaseUrl: _config.apiBaseUrl,
          ),
        )
        .toList();
  }

  Future<void> updateCandidateStatus({
    required int responseId,
    required String status,
  }) {
    return _api.put<Map<String, dynamic>>(
      '/replacement-responses/$responseId/update-status',
      data: {'status': status},
    );
  }

  /// All of my postings that have received at least one response — one
  /// summary card per posting, response count included. Mirrors web's
  /// `/dashboard/replacements/responses` aggregate view; drilling into a
  /// posting still goes through [fetchCandidates] via
  /// `ReplacementCandidatesScreen`.
  Future<List<ReplacementItem>> fetchMyResponseGroups({
    required int userId,
    bool older = false,
  }) async {
    final response = await _api.get<Map<String, dynamic>>(
      '/replacement-responses/nurse/$userId',
      queryParameters: {'older': older},
    );

    final data = response.data?['data'];
    if (data is! List) {
      return const [];
    }

    return data
        .whereType<Map>()
        .map((entry) {
          final parent = entry['parent'];
          if (parent is! Map) {
            return null;
          }
          final parentMap =
              parent.map((key, value) => MapEntry(key.toString(), value));
          final responses = entry['responses'];
          parentMap['response_count'] = responses is List ? responses.length : 0;
          return ReplacementMapper.fromReplacementJson(parentMap);
        })
        .whereType<ReplacementItem>()
        .toList();
  }

  Future<ReplacementSearchPage> _fetchMergedPage(
    Map<String, dynamic> body,
  ) async {
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

    return ReplacementSearchPage(items: items, total: total);
  }
}

class ReplacementSearchPage {
  const ReplacementSearchPage({required this.items, required this.total});

  final List<ReplacementItem> items;
  final int total;
}

final replacementsRepositoryProvider = Provider<ReplacementsRepository>((ref) {
  return ReplacementsRepository(
    apiClient: ref.watch(apiClientProvider),
    config: ref.watch(appConfigProvider),
  );
});
