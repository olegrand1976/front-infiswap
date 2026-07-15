import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/access_plan.dart';

class SubscriptionRepository {
  SubscriptionRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  Future<AccessPlan?> fetchAccessPlan() async {
    final response = await _api.get<Map<String, dynamic>>('/subscription/plans');
    final access = response.data?['access'];
    if (access is! Map) {
      return null;
    }
    final json = access.map((key, value) => MapEntry(key.toString(), value));
    if (json['interval']?.toString() != 'one_time') {
      return null;
    }
    return AccessPlan.fromJson(json);
  }
}

final subscriptionRepositoryProvider = Provider<SubscriptionRepository>((ref) {
  return SubscriptionRepository(apiClient: ref.watch(apiClientProvider));
});

/// L'endpoint /subscription/plans est public — pas besoin de session pour
/// afficher ce prix dans la feuille d'accès plateforme.
final accessPlanProvider = FutureProvider.autoDispose((ref) {
  return ref.watch(subscriptionRepositoryProvider).fetchAccessPlan();
});
