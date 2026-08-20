import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/pairing_item.dart';
import '../models/pairing_search_params.dart';
import 'pairings_repository.dart';

final pairingsLoadingMoreProvider = StateProvider<bool>((ref) => false);

class PairingsListNotifier extends AsyncNotifier<List<PairingItem>> {
  PairingSearchParams _params = PairingSearchParams.defaults;
  int _total = 0;

  PairingSearchParams get params => _params;
  bool get hasMore => (state.valueOrNull?.length ?? 0) < _total;

  @override
  Future<List<PairingItem>> build() async {
    _params = _params.copyWith(page: 1);
    final page = await ref.watch(pairingsRepositoryProvider).fetchList(_params);
    _total = page.total;
    return page.items;
  }

  Future<void> applyTab(PairingTab tab) =>
      _reload(_params.copyWith(tab: tab, page: 1));

  Future<void> applySearch({
    required List<String> zipCodes,
    required List<String> cities,
  }) {
    return _reload(
        _params.copyWith(zipCodes: zipCodes, cities: cities, page: 1));
  }

  Future<void> clearSearch() =>
      _reload(_params.copyWith(zipCodes: [], cities: [], page: 1));

  Future<void> refresh() => _reload(_params);

  Future<void> loadMore() async {
    final current = state.valueOrNull;
    if (current == null || !hasMore || ref.read(pairingsLoadingMoreProvider)) {
      return;
    }

    ref.read(pairingsLoadingMoreProvider.notifier).state = true;
    try {
      final nextParams = _params.copyWith(page: _params.page + 1);
      final page =
          await ref.read(pairingsRepositoryProvider).fetchList(nextParams);
      _params = nextParams;
      _total = page.total;
      state = AsyncData([...current, ...page.items]);
    } catch (_) {
    } finally {
      ref.read(pairingsLoadingMoreProvider.notifier).state = false;
    }
  }

  void markResponded(int pairingId) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData([
      for (final item in current)
        if (item.id == pairingId) item.copyWith(hasResponded: true) else item,
    ]);
  }

  Future<void> _reload(PairingSearchParams params) async {
    _params = params;
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final page =
          await ref.read(pairingsRepositoryProvider).fetchList(_params);
      _total = page.total;
      return page.items;
    });
  }
}

final pairingsListProvider =
    AsyncNotifierProvider<PairingsListNotifier, List<PairingItem>>(
  PairingsListNotifier.new,
);
