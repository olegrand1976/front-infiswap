import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../models/access_plan.dart';
import '../models/boost_plan.dart';

class SubscriptionRepository {
  SubscriptionRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  Future<AccessPlan?> fetchAccessPlan() async {
    final response =
        await _api.get<Map<String, dynamic>>('/subscription/plans');
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

  Future<List<BoostPlan>> fetchReplacementBoostPlans() async {
    final response = await _api
        .get<Map<String, dynamic>>('/subscription/boosts/replacement');
    final plans = response.data?['plans'];
    if (plans is! List) {
      return const [];
    }
    return plans
        .whereType<Map>()
        .map(
          (plan) => BoostPlan.fromJson(
            plan.map((key, value) => MapEntry(key.toString(), value)),
          ),
        )
        .toList();
  }

  Future<String> createReplacementBoostCheckout({
    required int replacementId,
    required int planId,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/subscription/replacements/$replacementId/boost',
      data: {'plan_id': planId},
    );
    final url = response.data?['url']?.toString();
    if (url == null || url.isEmpty) {
      throw ApiException(message: 'Lien de paiement indisponible.');
    }
    return url;
  }
}

final subscriptionRepositoryProvider = Provider<SubscriptionRepository>((ref) {
  return SubscriptionRepository(apiClient: ref.watch(apiClientProvider));
});

final accessPlanProvider = FutureProvider.autoDispose((ref) {
  return ref.watch(subscriptionRepositoryProvider).fetchAccessPlan();
});

final replacementBoostPlansProvider = FutureProvider.autoDispose((ref) {
  return ref.watch(subscriptionRepositoryProvider).fetchReplacementBoostPlans();
});
