import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/create_replacement_payload.dart';

class ReplacementCreateRepository {
  ReplacementCreateRepository({required ApiClient apiClient})
      : _api = apiClient;

  final ApiClient _api;

  // Create classic replacement
  Future<int?> createClassic(ClassicReplacementPayload payload) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/replacements',
      data: payload.toJson(),
    );

    final replacement = response.data?['replacement'];
    if (replacement is Map && replacement['id'] != null) {
      return int.tryParse(replacement['id'].toString());
    }
    return null;
  }

  // Create immediate replacement
  Future<void> createImmediate(ImmediateReplacementPayload payload) async {
    await _api.post<Map<String, dynamic>>(
      '/replacements/immediate',
      data: payload.toJson(),
    );
  }
}

final replacementCreateRepositoryProvider =
    Provider<ReplacementCreateRepository>((ref) {
  return ReplacementCreateRepository(apiClient: ref.watch(apiClientProvider));
});
