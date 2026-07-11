import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/providers/auth_session_provider.dart';
import '../models/application_item.dart';
import 'applications_repository.dart';

class ApplicationsListNotifier extends AsyncNotifier<List<ApplicationItem>> {
  @override
  Future<List<ApplicationItem>> build() async {
    final userId = _userId;
    if (userId == null) {
      throw StateError('Utilisateur non connecté.');
    }

    final repository = ref.watch(applicationsRepositoryProvider);
    return repository.fetchApplied(userId);
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
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final userId = _userId;
      if (userId == null) {
        throw StateError('Utilisateur non connecté.');
      }
      return ref.read(applicationsRepositoryProvider).fetchApplied(userId);
    });
  }
}

final applicationsListProvider =
    AsyncNotifierProvider<ApplicationsListNotifier, List<ApplicationItem>>(
  ApplicationsListNotifier.new,
);
