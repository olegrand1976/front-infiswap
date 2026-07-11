import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/config/app_config.dart';
import '../data/application_mapper.dart';
import '../models/application_item.dart';

class ApplicationsRepository {
  ApplicationsRepository({
    required ApiClient apiClient,
    required AppConfig config,
  })  : _api = apiClient,
        _config = config;

  final ApiClient _api;
  final AppConfig _config;

  Future<List<ApplicationItem>> fetchApplied(int userId) async {
    final response = await _api.get<Map<String, dynamic>>(
      '/replacement-responses/applied/$userId',
    );

    final data = response.data?['data'];
    if (data is! List) {
      return const [];
    }

    return data
        .whereType<Map>()
        .map(
          (item) => ApplicationMapper.fromAppliedJson(
            item.map((key, value) => MapEntry(key.toString(), value)),
            storageBaseUrl: _config.apiBaseUrl,
          ),
        )
        .toList();
  }
}

final applicationsRepositoryProvider = Provider<ApplicationsRepository>((ref) {
  return ApplicationsRepository(
    apiClient: ref.watch(apiClientProvider),
    config: ref.watch(appConfigProvider),
  );
});
