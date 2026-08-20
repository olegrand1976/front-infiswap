import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/pairing_response.dart';
import 'pairings_repository.dart';

class PairingResponsesNotifier extends AsyncNotifier<List<PairingResponse>> {
  @override
  Future<List<PairingResponse>> build() {
    return ref.watch(pairingsRepositoryProvider).fetchMyResponses();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(pairingsRepositoryProvider).fetchMyResponses(),
    );
  }

  Future<void> updateStatus(int responseId, String status) async {
    await ref
        .read(pairingsRepositoryProvider)
        .updateResponseStatus(responseId: responseId, status: status);

    final current = state.valueOrNull;
    if (current == null) return;

    final target = current.firstWhere((r) => r.id == responseId);
    state = AsyncData([
      for (final response in current)
        if (response.id == responseId)
          response.copyWith(status: status)
        else if (response.pairingId == target.pairingId &&
            response.status == 'pending')
          response.copyWith(status: 'canceled')
        else
          response,
    ]);
  }
}

final pairingResponsesProvider =
    AsyncNotifierProvider<PairingResponsesNotifier, List<PairingResponse>>(
  PairingResponsesNotifier.new,
);
