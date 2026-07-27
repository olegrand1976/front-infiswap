import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/settings_models.dart';

class SettingsRepository {
  SettingsRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  Future<Map<String, dynamic>> fetchSettings() async {
    final response = await _api.get<Map<String, dynamic>>('/users/settings');
    final settings = response.data?['settings'];
    return settings is Map
        ? settings.map((key, value) => MapEntry(key.toString(), value))
        : <String, dynamic>{};
  }

  // update-information/update-address/update-profil return the raw Eloquent
  // User model, not the flat UserResource shape the rest of the app relies
  // on — callers should refetch /user afterwards rather than trust this body.
  Future<void> updateInformation({
    required int userId,
    required PersonalInfoData data,
  }) {
    return _api.put<Map<String, dynamic>>(
      '/users/$userId/update-information',
      data: {
        'lastname': data.lastname,
        'firstname': data.firstname,
        'dateOfBirth': data.dateOfBirth?.toIso8601String().split('T').first,
        'email': data.email,
        'identifierNumber': data.identifierNumber,
        'phoneNumber': data.phoneNumber,
        'gender': data.gender,
        'professionalCategory': data.professionalCategory,
      },
    );
  }

  Future<void> updateAddress({
    required int userId,
    required AddressData data,
  }) {
    return _api.put<Map<String, dynamic>>(
      '/users/$userId/update-address',
      data: {
        'streetAddress': data.streetAddress,
        'city': data.city,
        'country': data.country,
        'zipCode': data.zipCode,
        'additionalInfo': data.additionalInfo,
        'workingAt': data.workingAt,
      },
    );
  }

  Future<void> updatePassword({
    required int userId,
    required String currentPassword,
    required String password,
    required String passwordConfirmation,
  }) {
    return _api.put<Map<String, dynamic>>(
      '/users/$userId/update-password',
      data: {
        'currentPassword': currentPassword,
        'password': password,
        'password_confirmation': passwordConfirmation,
      },
    );
  }

  Future<void> updateAvatar({
    required int userId,
    required String filePath,
  }) async {
    final formData = FormData.fromMap({
      'profil_url': await MultipartFile.fromFile(filePath),
    });
    await _api.post<Map<String, dynamic>>(
      '/users/$userId/update-profil',
      data: formData,
    );
  }

  Future<void> deleteAvatar({required int userId}) {
    return _api.delete<void>('/users/$userId/delete-profil');
  }

  Future<void> enableTwoFactor() {
    return _api.post<Map<String, dynamic>>(
      '/users/2fa/toggle',
      data: {
        'twoFactorEnabled': true,
        'twoFactorType': 'mail',
      },
    );
  }

  Future<void> disableTwoFactor({required String currentPassword}) {
    return _api.post<Map<String, dynamic>>(
      '/users/2fa/toggle',
      data: {
        'twoFactorEnabled': false,
        'currentPassword': currentPassword,
      },
    );
  }

  Future<void> verifyTwoFactorCode({required String code}) {
    return _api.post<Map<String, dynamic>>(
      '/users/2fa/verify',
      data: {'code': code},
    );
  }

  Future<void> updateNotificationPreferences(NotificationPreferences prefs) {
    return _api.post<Map<String, dynamic>>(
      '/users/settings/notification',
      data: {
        'key': 'notification',
        'value': prefs.toJson(),
      },
    );
  }

  Future<void> addZonePreferences({
    required List<String> cities,
    required List<String> zipCodes,
  }) {
    return _api.post<Map<String, dynamic>>(
      '/users/settings',
      data: {
        'key': 'replacement',
        'value': {
          'cities': cities,
          'zip_codes': zipCodes,
        },
      },
    );
  }

  Future<void> deleteAccount({
    required int userId,
    required String password,
  }) {
    return _api.delete<void>(
      '/users/$userId/soft-delete',
      data: {'password': password},
    );
  }
}

final settingsRepositoryProvider = Provider<SettingsRepository>((ref) {
  return SettingsRepository(apiClient: ref.watch(apiClientProvider));
});
