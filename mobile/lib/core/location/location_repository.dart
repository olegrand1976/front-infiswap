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
}

final locationRepositoryProvider = Provider<LocationRepository>((ref) {
  return LocationRepository(apiClient: ref.watch(apiClientProvider));
});
