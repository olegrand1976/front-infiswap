import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/providers/auth_session_provider.dart';
import '../models/replacement_item.dart';
import 'replacements_repository.dart';

final myReplacementsLoadingMoreProvider = StateProvider<bool>((ref) => false);

class MyReplacementsListNotifier extends AsyncNotifier<List<ReplacementItem>> {
  static const _perPage = 25;

  int _page = 1;
  bool _hasMore = true;

  bool get hasMore => _hasMore;

  @override
  Future<List<ReplacementItem>> build() async {
    if (ref.watch(authSessionProvider) == null) {
      throw StateError('Utilisateur non connecté.');
    }
    _page = 1;
    final repository = ref.watch(replacementsRepositoryProvider);
    final page = await repository.fetchMyReplacements(page: 1, perPage: _perPage);
    _hasMore = page.items.length < page.total;
    return page.items;
  }

  Future<void> refresh() async {
    _page = 1;
    _hasMore = true;
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final page = await ref
          .read(replacementsRepositoryProvider)
          .fetchMyReplacements(page: 1, perPage: _perPage);
      _hasMore = page.items.length < page.total;
      return page.items;
    });
  }

  Future<void> loadMore() async {
    if (!_hasMore || ref.read(myReplacementsLoadingMoreProvider)) {
      return;
    }
    final current = state.valueOrNull;
    if (current == null) {
      return;
    }

    ref.read(myReplacementsLoadingMoreProvider.notifier).state = true;
    try {
      final nextPage = _page + 1;
      final page = await ref
          .read(replacementsRepositoryProvider)
          .fetchMyReplacements(page: nextPage, perPage: _perPage);
      _page = nextPage;
      final merged = [...current, ...page.items];
      _hasMore = merged.length < page.total;
      state = AsyncData(merged);
    } catch (_) {
      // Silent: the user can retry by scrolling again; the existing list stays intact.
    } finally {
      ref.read(myReplacementsLoadingMoreProvider.notifier).state = false;
    }
  }
}

final myReplacementsListProvider =
    AsyncNotifierProvider<MyReplacementsListNotifier, List<ReplacementItem>>(
  MyReplacementsListNotifier.new,
);
