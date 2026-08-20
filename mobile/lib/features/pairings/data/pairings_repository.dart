import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/pairing_item.dart';
import '../models/pairing_response.dart';
import '../models/pairing_search_params.dart';

class PairingSearchPage {
  const PairingSearchPage({required this.items, required this.total});

  final List<PairingItem> items;
  final int total;
}

class PairingsRepository {
  PairingsRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  Future<PairingSearchPage> fetchList(PairingSearchParams params) async {
    final response = await _api.get<Map<String, dynamic>>(
      '/partners',
      queryParameters: params.toQuery(),
    );

    final root = response.data ?? const {};
    final data = (root['partnerships'] as Map?)?['data'];
    final items = data is List
        ? data
            .whereType<Map>()
            .map((item) => PairingItem.fromJson(item.cast<String, dynamic>()))
            .toList()
        : <PairingItem>[];

    final total = int.tryParse(root['count']?.toString() ?? '') ?? items.length;
    return PairingSearchPage(items: items, total: total);
  }

  Future<void> create({required PairingType type, String? description}) {
    final trimmed = description?.trim();
    return _api.post<void>('/partners/create', data: {
      'type': pairingTypeApiValue(type),
      if (trimmed != null && trimmed.isNotEmpty) 'description': trimmed,
    });
  }

  Future<void> close(int pairingId) {
    return _api.put<void>('/partners/$pairingId', data: {'status': 'closed'});
  }

  // `userInterestedId` is validated by the API (exists:users,id) but never
  // actually read when saving — it always uses the authenticated user. Any
  // valid id satisfies validation; sending the caller's own is the honest one.
  Future<void> respond({
    required int pairingId,
    required int currentUserId,
    String? description,
  }) {
    final trimmed = description?.trim();
    return _api.post<void>('/partners/responses/send', data: {
      'userPartnerId': pairingId,
      'userInterestedId': currentUserId,
      'status': 'pending',
      if (trimmed != null && trimmed.isNotEmpty) 'description': trimmed,
    });
  }

  Future<List<PairingResponse>> fetchMyResponses() async {
    final response =
        await _api.get<Map<String, dynamic>>('/partners/responses/receive');
    final data = response.data?['responses'];
    if (data is! List) {
      return const [];
    }
    return data
        .whereType<Map>()
        .map((item) => PairingResponse.fromJson(item.cast<String, dynamic>()))
        .toList();
  }

  Future<void> updateResponseStatus({
    required int responseId,
    required String status,
  }) {
    return _api.put<void>(
      '/partners/responses/$responseId/status',
      data: {'status': status},
    );
  }
}

final pairingsRepositoryProvider = Provider<PairingsRepository>((ref) {
  return PairingsRepository(apiClient: ref.watch(apiClientProvider));
});
