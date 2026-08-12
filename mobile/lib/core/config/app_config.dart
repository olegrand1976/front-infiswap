import 'package:flutter_riverpod/flutter_riverpod.dart';

class AppConfig {
  const AppConfig({
    required this.apiBaseUrl,
    required this.webBaseUrl,
  });

  final String apiBaseUrl;

  final String webBaseUrl;

  String get apiUrl => '$apiBaseUrl/api';

  static AppConfig fromEnvironment() {
    const baseUrl = String.fromEnvironment(
      'API_BASE_URL',
      defaultValue: 'http://10.0.2.2:8094',
    );
    const webUrl = String.fromEnvironment(
      'WEB_BASE_URL',
      defaultValue: 'https://infiswap.be',
    );

    return AppConfig(
      apiBaseUrl: _trimTrailingSlash(baseUrl),
      webBaseUrl: _trimTrailingSlash(webUrl),
    );
  }

  static String _trimTrailingSlash(String value) {
    return value.endsWith('/') ? value.substring(0, value.length - 1) : value;
  }
}

final appConfigProvider = Provider<AppConfig>((ref) {
  return AppConfig.fromEnvironment();
});
