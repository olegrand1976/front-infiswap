import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/config/app_config.dart';
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
    final response = await _api.post<Map<String, dynamic>>(
      '/replacements/search/merged',
      data: params.toApiBody(),
    );

    final root = response.data ?? {};
    final replacements = root['replacements'];
    if (replacements is! Map) {
      throw ApiException(message: 'Réponse liste invalide.');
    }

    final data = replacements['data'];
    if (data is! List) {
      return const [];
    }

    return data
        .whereType<Map>()
        .map(
          (item) => ReplacementMapper.fromMergedJson(
            item.map((key, value) => MapEntry(key.toString(), value)),
            storageBaseUrl: _config.apiBaseUrl,
          ),
        )
        .toList();
  }
}

final replacementsRepositoryProvider = Provider<ReplacementsRepository>((ref) {
  return ReplacementsRepository(
    apiClient: ref.watch(apiClientProvider),
    config: ref.watch(appConfigProvider),
  );
});
