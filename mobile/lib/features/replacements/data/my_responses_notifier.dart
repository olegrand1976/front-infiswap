import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/async_value_refreshing.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../models/replacement_item.dart';
import 'replacements_repository.dart';

/// Aggregated view of every posting of mine that has received at least one
/// response — see [ReplacementsRepository.fetchMyResponseGroups].
class MyResponsesNotifier extends AsyncNotifier<List<ReplacementItem>> {
  @override
  Future<List<ReplacementItem>> build() async {
    ref.watch(authSessionProvider.select((s) => s?.user['id']));
    final userId = _requireUserId();
    return ref.watch(replacementsRepositoryProvider).fetchMyResponseGroups(
          userId: userId,
        );
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

  int _requireUserId() {
    final id = _userId;
    if (id == null) {
      throw StateError('Utilisateur non connecté.');
    }
    return id;
  }

  Future<void> refresh() async {
    state = state.refreshing;
    state = await AsyncValue.guard(() async {
      final userId = _requireUserId();
      return ref
          .read(replacementsRepositoryProvider)
          .fetchMyResponseGroups(userId: userId);
    });
  }
}

final myResponsesProvider =
    AsyncNotifierProvider<MyResponsesNotifier, List<ReplacementItem>>(
  MyResponsesNotifier.new,
);
