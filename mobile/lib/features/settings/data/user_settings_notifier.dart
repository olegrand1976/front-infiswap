import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/async_value_refreshing.dart';
import '../../auth/providers/auth_session_provider.dart';
import 'settings_repository.dart';

class UserSettingsNotifier extends AsyncNotifier<Map<String, dynamic>> {
  @override
  Future<Map<String, dynamic>> build() async {
    final userId = ref.watch(authSessionProvider.select((s) => s?.user['id']));
    if (userId == null) return {};
    return ref.read(settingsRepositoryProvider).fetchSettings();
  }

  void setValue(String key, Object value) {
    final current = state.valueOrNull;
    if (current == null) return;
    state = AsyncData({...current, key: value});
  }

  Future<void> refresh() async {
    state = state.refreshing;
    state = await AsyncValue.guard(
      () => ref.read(settingsRepositoryProvider).fetchSettings(),
    );
  }
}

final userSettingsProvider =
    AsyncNotifierProvider<UserSettingsNotifier, Map<String, dynamic>>(
  UserSettingsNotifier.new,
);
