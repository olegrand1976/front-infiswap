import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';

class LocationRepository {
  LocationRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  Future<List<String>> getCitiesFromZipCode(String zipCode) async {
    final response = await _api.get<List<dynamic>>(
      '/location/cities',
      queryParameters: {'code': zipCode},
    );
    return (response.data ?? const []).whereType<String>().toList();
  }

  Future<List<String>> getZipCodesFromCity(String city) async {
    final response = await _api.get<List<dynamic>>(
      '/location/postal-codes',
      queryParameters: {'city': city},
    );
    return (response.data ?? const []).whereType<String>().toList();
  }

  Future<List<(String, String)>> getNearbyLocalities({
    required String zipCode,
    required String country,
    List<String> excludeZipCodes = const [],
    List<String> excludeCities = const [],
  }) async {
    final response = await _api.get<List<dynamic>>(
      '/location/nearby',
      queryParameters: {
        'code': zipCode,
        'radius': 5,
        'country': country,
        if (excludeZipCodes.isNotEmpty)
          'exclude_zip_codes': excludeZipCodes.join(','),
        if (excludeCities.isNotEmpty) 'exclude_cities': excludeCities.join(','),
      },
    );
    return [
      for (final item in response.data ?? const [])
        if (item is List && item.length >= 2)
          (item[0].toString(), item[1].toString()),
    ];
  }
}

final locationRepositoryProvider = Provider<LocationRepository>((ref) {
  return LocationRepository(apiClient: ref.watch(apiClientProvider));
});
