import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/providers/auth_session_provider.dart';
import '../config/app_config.dart';
import '../storage/token_storage.dart';
import 'api_exception.dart';

typedef TokenReader = Future<String?> Function();
typedef OnUnauthorized = Future<void> Function();

class ApiClient {
  ApiClient({
    required AppConfig config,
    required TokenReader readToken,
    OnUnauthorized? onUnauthorized,
  })  : _readToken = readToken,
        _onUnauthorized = onUnauthorized,
        _healthUrl = '${config.apiBaseUrl}/up',
        _dio = Dio(
          BaseOptions(
            baseUrl: config.apiUrl,
            connectTimeout: const Duration(seconds: 15),
            receiveTimeout: const Duration(seconds: 30),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          ),
        ) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _readToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            await _onUnauthorized?.call();
          }
          handler.next(error);
        },
      ),
    );
  }

  final Dio _dio;
  final TokenReader _readToken;
  final OnUnauthorized? _onUnauthorized;
  final String _healthUrl;

  Future<void> warmUp() async {
    try {
      await _dio.get<void>(_healthUrl);
    } catch (_) {
      // Best-effort ping to wake a cold Cloud Run instance early.
    }
  }

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    return _request(() => _dio.get<T>(path, queryParameters: queryParameters));
  }

  Future<Response<T>> post<T>(
    String path, {
    Object? data,
  }) async {
    return _request(() => _dio.post<T>(path, data: data));
  }

  Future<Response<T>> put<T>(
    String path, {
    Object? data,
  }) async {
    return _request(() => _dio.put<T>(path, data: data));
  }

  Future<Response<T>> delete<T>(
    String path, {
    Object? data,
  }) async {
    return _request(() => _dio.delete<T>(path, data: data));
  }

  static const _coldStartStatusCodes = {502, 503, 504};
  static const _coldStartRetryDelays = [
    Duration(seconds: 2),
    Duration(seconds: 4),
  ];

  Future<Response<T>> _request<T>(Future<Response<T>> Function() call) async {
    for (var attempt = 0; ; attempt++) {
      try {
        return await call();
      } on DioException catch (error) {
        final isColdStart = _coldStartStatusCodes.contains(
          error.response?.statusCode,
        );
        if (!isColdStart || attempt >= _coldStartRetryDelays.length) {
          throw ApiException.fromDio(error);
        }
        await Future<void>.delayed(_coldStartRetryDelays[attempt]);
      }
    }
  }
}

final apiClientProvider = Provider<ApiClient>((ref) {
  final config = ref.watch(appConfigProvider);
  final tokenStorage = ref.watch(tokenStorageProvider);

  return ApiClient(
    config: config,
    readToken: tokenStorage.read,
    onUnauthorized: () async {
      await tokenStorage.delete();
      ref.read(authSessionProvider.notifier).state = null;
    },
  );
});
