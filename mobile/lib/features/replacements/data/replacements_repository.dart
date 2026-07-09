import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../models/replacement_item.dart';
import 'replacement_mapper.dart';

class ReplacementsRepository {
  ReplacementsRepository(this._api);

  final ApiClient _api;

  Future<List<ReplacementItem>> fetchMergedList({
    String country = 'be',
    int page = 1,
    int perPage = 25,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/replacements/search/merged',
      data: {
        'days': <String>[],
        'cities': <String>[],
        'zipCodes': <String>[],
        'type': '',
        'country': country,
        'filters': {
          'type': 'all',
          'role': 'all',
        },
        'provinces': <String>[],
        'page': page,
        'perPage': perPage,
        'groupByProvince': false,
      },
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
          ),
        )
        .toList();
  }

  Future<ReplacementItem> fetchReplacement(String id) async {
    final response = await _api.get<Map<String, dynamic>>(
      '/replacements/$id',
    );
    final root = response.data ?? {};
    final replacement = root['replacement'];
    if (replacement is! Map) {
      throw ApiException(message: 'Remplacement introuvable.');
    }

    return ReplacementMapper.fromReplacementJson(
      replacement.map((key, value) => MapEntry(key.toString(), value)),
    );
  }
}

final replacementsRepositoryProvider = Provider<ReplacementsRepository>((ref) {
  return ReplacementsRepository(ref.watch(apiClientProvider));
});

final replacementsListProvider =
    FutureProvider.autoDispose<List<ReplacementItem>>((ref) async {
  final repository = ref.watch(replacementsRepositoryProvider);
  return repository.fetchMergedList();
});
