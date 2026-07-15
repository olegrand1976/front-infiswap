import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/care_type.dart';

class CareTypesRepository {
  CareTypesRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  Future<List<CareType>> fetchAll() async {
    final response = await _api.get<Map<String, dynamic>>('/care-types');

    final data = response.data?['care_types'];
    if (data is! List) {
      return const [];
    }

    return data
        .whereType<Map>()
        .map(
          (item) => CareType.fromJson(
            item.map((key, value) => MapEntry(key.toString(), value)),
          ),
        )
        .toList();
  }
}

final careTypesRepositoryProvider = Provider<CareTypesRepository>((ref) {
  return CareTypesRepository(apiClient: ref.watch(apiClientProvider));
});

final careTypesProvider = FutureProvider<List<CareType>>((ref) {
  return ref.watch(careTypesRepositoryProvider).fetchAll();
});
