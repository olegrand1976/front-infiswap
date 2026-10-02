import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/async_value_refreshing.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../models/user_activity_stats.dart';
import 'home_dashboard_repository.dart';

class HomeDashboardNotifier extends AsyncNotifier<UserActivityStats> {
  @override
  Future<UserActivityStats> build() async {
    ref.watch(authSessionProvider.select((s) => s?.user['id']));
    _requireUserId();
    return ref.watch(homeDashboardRepositoryProvider).fetch();
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

  void _requireUserId() {
    if (_userId == null) {
      throw StateError('Utilisateur non connecté.');
    }
  }

  Future<void> refresh() async {
    state = state.refreshing;
    state = await AsyncValue.guard(() async {
      _requireUserId();
      return ref.read(homeDashboardRepositoryProvider).fetch();
    });
  }
}

final homeDashboardProvider =
    AsyncNotifierProvider<HomeDashboardNotifier, UserActivityStats>(
  HomeDashboardNotifier.new,
);
