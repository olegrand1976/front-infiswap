import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Configuration runtime de l'app (injectée via `--dart-define`).
class AppConfig {
  const AppConfig({
    required this.apiBaseUrl,
  });

  /// URL de base de l'API Laravel, sans slash final.
  /// Ex. `http://10.0.2.2:8095` (émulateur Android) ou `http://localhost:8095`.
  final String apiBaseUrl;

  String get apiUrl => '$apiBaseUrl/api';

  static AppConfig fromEnvironment() {
    const baseUrl = String.fromEnvironment(
      'API_BASE_URL',
      defaultValue: 'http://10.0.2.2:8095',
    );

    return AppConfig(apiBaseUrl: _trimTrailingSlash(baseUrl));
  }

  static String _trimTrailingSlash(String value) {
    return value.endsWith('/') ? value.substring(0, value.length - 1) : value;
  }
}

final appConfigProvider = Provider<AppConfig>((ref) {
  return AppConfig.fromEnvironment();
});
