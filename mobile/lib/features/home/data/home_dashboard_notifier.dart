import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/providers/auth_session_provider.dart';
import '../models/home_dashboard_data.dart';
import 'home_dashboard_repository.dart';

class HomeDashboardNotifier extends AsyncNotifier<HomeDashboardData> {
  @override
  Future<HomeDashboardData> build() async {
    final userId = _userId;
    if (userId == null) {
      throw StateError('Utilisateur non connecté.');
    }

    final repository = ref.watch(homeDashboardRepositoryProvider);
    return repository.fetch(userId);
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
      return ref.read(homeDashboardRepositoryProvider).fetch(userId);
    });
  }
}

final homeDashboardProvider =
    AsyncNotifierProvider<HomeDashboardNotifier, HomeDashboardData>(
  HomeDashboardNotifier.new,
);
