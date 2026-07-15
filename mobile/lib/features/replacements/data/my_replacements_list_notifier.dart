import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/providers/auth_session_provider.dart';
import '../models/replacement_item.dart';
import 'replacements_repository.dart';

class MyReplacementsListNotifier extends AsyncNotifier<List<ReplacementItem>> {
  @override
  Future<List<ReplacementItem>> build() async {
    if (ref.watch(authSessionProvider) == null) {
      throw StateError('Utilisateur non connecté.');
    }
    final repository = ref.watch(replacementsRepositoryProvider);
    return repository.fetchMyReplacements();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() {
      return ref.read(replacementsRepositoryProvider).fetchMyReplacements();
    });
  }
}

final myReplacementsListProvider =
    AsyncNotifierProvider<MyReplacementsListNotifier, List<ReplacementItem>>(
  MyReplacementsListNotifier.new,
);
