import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../../../core/storage/token_storage.dart';
import '../models/auth_models.dart';
import '../providers/auth_session_provider.dart';

class AuthRepository {
  AuthRepository({
    required ApiClient apiClient,
    required TokenStorage tokenStorage,
    required void Function() onSessionCleared,
  })  : _api = apiClient,
        _tokenStorage = tokenStorage,
        _onSessionCleared = onSessionCleared;

  final ApiClient _api;
  final TokenStorage _tokenStorage;
  final void Function() _onSessionCleared;

  Future<LoginResult> login({
    required String identifier,
    required String password,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/login',
      data: {
        'identifier': identifier.trim(),
        'password': password,
      },
    );

    final data = response.data ?? {};

    if (data['hash'] is String) {
      return LoginResult.twoFactorRequired(
        twoFactorHash: data['hash'] as String,
        message: data['message'] as String?,
      );
    }

    final token = data['token'];
    if (token is! String || token.isEmpty) {
      throw ApiException(message: 'Réponse de connexion invalide.');
    }

    await _tokenStorage.save(token);
    return LoginResult.authenticated(token: token);
  }

  Future<TwoFactorResult> verifyTwoFactor({
    required String hash,
    required String code,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/verify-2fa',
      data: {
        'hash': hash,
        'two_factor_code': code.trim(),
      },
    );

    final data = response.data ?? {};
    final token = data['token'];
    if (token is! String || token.isEmpty) {
      throw ApiException(message: 'Code invalide ou expiré.');
    }

    await _tokenStorage.save(token);

    final user = data['user'];
    if (user is Map<String, dynamic>) {
      return TwoFactorResult(token: token, user: user);
    }

    final currentUser = await fetchCurrentUser();
    return TwoFactorResult(token: token, user: currentUser);
  }

  Future<Map<String, dynamic>> fetchCurrentUser() async {
    final response = await _api.get<Map<String, dynamic>>('/user');
    final data = response.data;

    if (data == null) {
      throw ApiException(message: 'Utilisateur introuvable.');
    }

    return data;
  }

  Future<AuthSession?> restoreSession() async {
    final token = await _tokenStorage.read();
    if (token == null || token.isEmpty) {
      return null;
    }

    try {
      final user = await fetchCurrentUser();
      return AuthSession(token: token, user: user);
    } on ApiException catch (error) {
      if (error.statusCode == 401 || error.statusCode == 403) {
        await _tokenStorage.delete();
      }
      return null;
    }
  }

  Future<AuthSession> completeLogin(String token) async {
    final user = await fetchCurrentUser();
    return AuthSession(token: token, user: user);
  }

  Future<void> logout() async {
    try {
      await _api.post<void>('/logout');
    } on ApiException {
      // On efface la session locale même si l'API échoue.
    } finally {
      await _tokenStorage.delete();
      _onSessionCleared();
    }
  }
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    apiClient: ref.watch(apiClientProvider),
    tokenStorage: ref.watch(tokenStorageProvider),
    onSessionCleared: () {
      ref.read(authSessionProvider.notifier).state = null;
    },
  );
});

final authBootstrapProvider = FutureProvider<void>((ref) async {
  final repository = ref.read(authRepositoryProvider);

  final session = await repository.restoreSession();
  if (session != null) {
    ref.read(authSessionProvider.notifier).state = session;
  }
});
