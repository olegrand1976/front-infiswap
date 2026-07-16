import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../models/create_replacement_payload.dart';
import '../models/replacement_edit_data.dart';

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

  // Fetch the editable snapshot of a posted replacement
  Future<ReplacementEditData> fetchForEdit(int replacementId) async {
    final response = await _api.get<Map<String, dynamic>>(
      '/replacements/$replacementId',
    );

    final data = response.data?['replacement'];
    if (data is! Map) {
      throw ApiException(message: 'Réponse remplacement invalide.');
    }

    return ReplacementEditData.fromJson(
      data.map((key, value) => MapEntry(key.toString(), value)),
    );
  }

  // Update an existing classic replacement
  Future<void> updateAgain(
    int replacementId,
    UpdateReplacementPayload payload,
  ) async {
    await _api.put<Map<String, dynamic>>(
      '/replacements/update-again/$replacementId',
      data: payload.toJson(),
    );
  }
}

final replacementCreateRepositoryProvider =
    Provider<ReplacementCreateRepository>((ref) {
  return ReplacementCreateRepository(apiClient: ref.watch(apiClientProvider));
});
