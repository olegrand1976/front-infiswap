import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/async_value_refreshing.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../models/network_group.dart';
import '../models/network_member.dart';
import 'network_repository.dart';

final myNetworkGroupsProvider = FutureProvider<List<NetworkGroup>>((ref) {
  ref.watch(authSessionProvider.select((s) => s?.user['id']));
  return ref.watch(networkRepositoryProvider).fetchMyGroups();
});

final selectedNetworkGroupIdProvider = StateProvider<int?>((ref) => null);

final networkMembersLoadingMoreProvider = StateProvider<bool>((ref) => false);

class NetworkMembersNotifier
    extends FamilyAsyncNotifier<List<NetworkMember>, int> {
  String _query = '';
  int _page = 1;
  int _total = 0;

  String get query => _query;
  int get total => _total;
  bool get hasMore => (state.valueOrNull?.length ?? 0) < _total;

  @override
  Future<List<NetworkMember>> build(int groupId) async {
    ref.watch(authSessionProvider.select((s) => s?.user['id']));
    _page = 1;
    final page = await ref
        .watch(networkRepositoryProvider)
        .fetchMembers(groupId: groupId, page: _page, query: _query);
    _total = page.total;
    return page.items;
  }

  Future<void> search(String query) {
    if (query.trim() == _query) return Future.value();
    _query = query.trim();
    return _reload();
  }

  Future<void> refresh() => _reload(keepPrevious: true);

  Future<void> loadMore() async {
    final current = state.valueOrNull;
    if (current == null ||
        !hasMore ||
        ref.read(networkMembersLoadingMoreProvider)) {
      return;
    }

    ref.read(networkMembersLoadingMoreProvider.notifier).state = true;
    try {
      final page = await ref
          .read(networkRepositoryProvider)
          .fetchMembers(groupId: arg, page: _page + 1, query: _query);
      _page++;
      _total = page.total;
      state = AsyncData([...current, ...page.items]);
    } catch (_) {
    } finally {
      ref.read(networkMembersLoadingMoreProvider.notifier).state = false;
    }
  }

  Future<void> _reload({bool keepPrevious = false}) async {
    _page = 1;
    state = keepPrevious ? state.refreshing : const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final page = await ref
          .read(networkRepositoryProvider)
          .fetchMembers(groupId: arg, page: _page, query: _query);
      _total = page.total;
      return page.items;
    });
  }
}

final networkMembersProvider = AsyncNotifierProvider.family<
    NetworkMembersNotifier, List<NetworkMember>, int>(
  NetworkMembersNotifier.new,
);
