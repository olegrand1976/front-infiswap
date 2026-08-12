import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';

class DeviceTokenRepository {
  DeviceTokenRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  // Register (or re-attach) this device's push token for the current user.
  Future<void> register(String token, String platform) async {
    await _api.post<Map<String, dynamic>>(
      '/notifications/device-token',
      data: {'token': token, 'platform': platform},
    );
  }

  // Unregister a push token, typically called on logout.
  Future<void> unregister(String token) async {
    await _api.delete<void>(
      '/notifications/device-token',
      data: {'token': token},
    );
  }
}

final deviceTokenRepositoryProvider = Provider<DeviceTokenRepository>((ref) {
  return DeviceTokenRepository(apiClient: ref.watch(apiClientProvider));
});
