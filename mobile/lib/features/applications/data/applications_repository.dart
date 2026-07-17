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

  Future<ApplicationsPage> fetchApplied(
    int userId, {
    int page = 1,
    int perPage = 25,
  }) async {
    final response = await _api.get<Map<String, dynamic>>(
      '/replacement-responses/applied/$userId',
      queryParameters: {'page': page, 'perPage': perPage},
    );

    final data = response.data?['data'];
    final items = data is List
        ? data
            .whereType<Map>()
            .map(
              (item) => ApplicationMapper.fromAppliedJson(
                item.map((key, value) => MapEntry(key.toString(), value)),
                storageBaseUrl: _config.apiBaseUrl,
              ),
            )
            .toList()
        : <ApplicationItem>[];

    final total =
        int.tryParse(response.data?['total']?.toString() ?? '') ?? items.length;

    return ApplicationsPage(items: items, total: total);
  }

  Future<void> applyToReplacement({
    required int replacementId,
    required int userId,
    String? comment,
  }) {
    return _api.post<Map<String, dynamic>>(
      '/replacement-responses/send',
      data: {
        'replacementId': replacementId,
        'respondedBy': userId,
        'institutionId': null,
        if (comment != null && comment.isNotEmpty) 'comment': comment,
      },
    );
  }

  Future<void> applyToMission({
    required int missionId,
    required int userId,
    String? description,
  }) {
    return _api.post<Map<String, dynamic>>(
      '/institution/missions/responses',
      data: {
        'mission_id': missionId,
        'responded_by': userId,
        if (description != null && description.isNotEmpty) 'description': description,
      },
    );
  }
}

final applicationsRepositoryProvider = Provider<ApplicationsRepository>((ref) {
  return ApplicationsRepository(
    apiClient: ref.watch(apiClientProvider),
    config: ref.watch(appConfigProvider),
  );
});

class ApplicationsPage {
  const ApplicationsPage({required this.items, required this.total});

  final List<ApplicationItem> items;
  final int total;
}
