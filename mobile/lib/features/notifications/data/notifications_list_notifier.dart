import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/providers/auth_session_provider.dart';
import '../models/notification_item.dart';
import 'notifications_repository.dart';

final notificationsLoadingMoreProvider = StateProvider<bool>((ref) => false);

class NotificationsListNotifier extends AsyncNotifier<List<NotificationItem>> {
  static const _perPage = 25;

  int _page = 1;
  bool _hasMore = true;

  bool get hasMore => _hasMore;

  @override
  Future<List<NotificationItem>> build() async {
    if (ref.watch(authSessionProvider) == null) {
      throw StateError('Utilisateur non connecté.');
    }

    _page = 1;
    final repository = ref.watch(notificationsRepositoryProvider);
    final page = await repository.fetchPage(page: 1, perPage: _perPage);
    _hasMore = page.items.length < page.total;
    return page.items;
  }

  Future<void> refresh() async {
    _page = 1;
    _hasMore = true;
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final page = await ref
          .read(notificationsRepositoryProvider)
          .fetchPage(page: 1, perPage: _perPage);
      _hasMore = page.items.length < page.total;
      return page.items;
    });
  }

  Future<void> loadMore() async {
    if (!_hasMore || ref.read(notificationsLoadingMoreProvider)) {
      return;
    }
    final current = state.valueOrNull;
    if (current == null) {
      return;
    }

    ref.read(notificationsLoadingMoreProvider.notifier).state = true;
    try {
      final nextPage = _page + 1;
      final page = await ref
          .read(notificationsRepositoryProvider)
          .fetchPage(page: nextPage, perPage: _perPage);
      _page = nextPage;
      final merged = [...current, ...page.items];
      _hasMore = merged.length < page.total;
      state = AsyncData(merged);
    } catch (_) {
      // Silent: the user can retry by scrolling again; the existing list stays intact.
    } finally {
      ref.read(notificationsLoadingMoreProvider.notifier).state = false;
    }
  }

  Future<void> markAsRead(int notificationId) async {
    final current = state.valueOrNull;
    if (current == null) return;

    await ref.read(notificationsRepositoryProvider).markAsRead(notificationId);

    state = AsyncData([
      for (final item in current)
        if (item.id == notificationId)
          NotificationItem(
            id: item.id,
            type: item.type,
            data: item.data,
            createdAt: item.createdAt,
            readAt: DateTime.now(),
          )
        else
          item,
    ]);
    ref.invalidate(unreadNotificationCountProvider);
  }

  Future<void> markAllAsRead() async {
    final current = state.valueOrNull;
    if (current == null) return;

    await ref.read(notificationsRepositoryProvider).markAllAsRead();

    final now = DateTime.now();
    state = AsyncData([
      for (final item in current)
        NotificationItem(
          id: item.id,
          type: item.type,
          data: item.data,
          createdAt: item.createdAt,
          readAt: item.readAt ?? now,
        ),
    ]);
    ref.invalidate(unreadNotificationCountProvider);
  }
}

final notificationsListProvider =
    AsyncNotifierProvider<NotificationsListNotifier, List<NotificationItem>>(
  NotificationsListNotifier.new,
);

// Total unread count, backing the bottom-nav Notifications badge.
final unreadNotificationCountProvider = FutureProvider.autoDispose<int>((ref) {
  if (ref.watch(authSessionProvider) == null) {
    return 0;
  }
  return ref.watch(notificationsRepositoryProvider).unreadCount();
});

// Unread "new replacement" count, backing the bottom-nav Remplacements badge.
final newReplacementsCountProvider = FutureProvider.autoDispose<int>((ref) {
  if (ref.watch(authSessionProvider) == null) {
    return 0;
  }
  return ref
      .watch(notificationsRepositoryProvider)
      .unreadCount(type: 'replacement.new');
});
