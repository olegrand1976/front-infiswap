import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/providers/auth_session_provider.dart';
import '../models/application_item.dart';
import 'applications_repository.dart';

final applicationsLoadingMoreProvider = StateProvider<bool>((ref) => false);

class ApplicationsListNotifier extends AsyncNotifier<List<ApplicationItem>> {
  static const _perPage = 25;

  int _page = 1;
  bool _hasMore = true;

  bool get hasMore => _hasMore;

  @override
  Future<List<ApplicationItem>> build() async {
    final userId = _userId;
    if (userId == null) {
      throw StateError('Utilisateur non connecté.');
    }

    _page = 1;
    final repository = ref.watch(applicationsRepositoryProvider);
    final page = await repository.fetchApplied(userId, page: 1, perPage: _perPage);
    _hasMore = page.items.length < page.total;
    return page.items;
  }

  int? get _userId {
    final id = ref.read(authSessionProvider)?.user['id'];
    if (id is int) {
      return id;
    }
    if (id is String) {
      return int.tryParse(id);
    }
    return null;
  }

  Future<void> refresh() async {
    _page = 1;
    _hasMore = true;
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final userId = _userId;
      if (userId == null) {
        throw StateError('Utilisateur non connecté.');
      }
      final page = await ref
          .read(applicationsRepositoryProvider)
          .fetchApplied(userId, page: 1, perPage: _perPage);
      _hasMore = page.items.length < page.total;
      return page.items;
    });
  }

  Future<void> loadMore() async {
    if (!_hasMore || ref.read(applicationsLoadingMoreProvider)) {
      return;
    }
    final current = state.valueOrNull;
    final userId = _userId;
    if (current == null || userId == null) {
      return;
    }

    ref.read(applicationsLoadingMoreProvider.notifier).state = true;
    try {
      final nextPage = _page + 1;
      final page = await ref
          .read(applicationsRepositoryProvider)
          .fetchApplied(userId, page: nextPage, perPage: _perPage);
      _page = nextPage;
      final merged = [...current, ...page.items];
      _hasMore = merged.length < page.total;
      state = AsyncData(merged);
    } catch (_) {
      // Silent: the user can retry by scrolling again; the existing list stays intact.
    } finally {
      ref.read(applicationsLoadingMoreProvider.notifier).state = false;
    }
  }
}

final applicationsListProvider =
    AsyncNotifierProvider<ApplicationsListNotifier, List<ApplicationItem>>(
  ApplicationsListNotifier.new,
);
