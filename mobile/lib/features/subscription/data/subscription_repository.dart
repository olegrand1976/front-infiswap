import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_exception.dart';
import '../models/access_plan.dart';
import '../models/boost_plan.dart';
import '../models/pro_plan.dart';
import '../models/pro_subscription_status.dart';

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
    required String platform,
    String? returnOrigin,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/subscription/replacements/$replacementId/boost',
      data: {
        'plan_id': planId,
        'platform': platform,
        if (returnOrigin != null) 'return_origin': returnOrigin,
      },
    );
    final url = response.data?['url']?.toString();
    if (url == null || url.isEmpty) {
      throw ApiException(message: 'Lien de paiement indisponible.');
    }
    return url;
  }

  Future<bool> confirmReplacementBoost({
    required int replacementId,
    required String sessionId,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/subscription/replacements/$replacementId/boost/confirm',
      data: {'session_id': sessionId},
    );
    return response.data?['status']?.toString() == 'active';
  }

  Future<ProSubscriptionStatus> fetchProStatus() async {
    final response = await _api.get<Map<String, dynamic>>('/subscription/pro/status');
    return ProSubscriptionStatus.fromJson(response.data ?? const {});
  }

  Future<List<ProPlan>> fetchProCatalog() async {
    final response = await _api.get<Map<String, dynamic>>('/subscription/pro/catalog');
    final plans = response.data?['plans'];
    if (plans is! List) {
      return const [];
    }
    return plans
        .whereType<Map>()
        .map((plan) => ProPlan.fromJson(plan.map((key, value) => MapEntry(key.toString(), value))))
        .toList();
  }

  Future<String> createProCheckout({
    required String lookupKey,
    required String platform,
    String? returnOrigin,
  }) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/subscription/pro/checkout',
      data: {
        'lookup_key': lookupKey,
        'platform': platform,
        if (returnOrigin != null) 'return_origin': returnOrigin,
      },
    );
    final url = response.data?['url']?.toString();
    if (url == null || url.isEmpty) {
      throw ApiException(message: 'Lien de paiement indisponible.');
    }
    return url;
  }

  Future<bool> confirmProCheckout({required String sessionId}) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/subscription/pro/confirm',
      data: {'session_id': sessionId},
    );
    return response.data?['outcome']?.toString() == 'active';
  }

  Future<String> openProBillingPortal({String? returnUrl}) async {
    final response = await _api.post<Map<String, dynamic>>(
      '/subscription/pro/portal',
      data: {if (returnUrl != null) 'return_url': returnUrl},
    );
    final url = response.data?['url']?.toString();
    if (url == null || url.isEmpty) {
      throw ApiException(message: 'Portail de facturation indisponible.');
    }
    return url;
  }

  Future<void> cancelProSubscription() {
    return _api.post<Map<String, dynamic>>('/subscription/pro/cancel');
  }

  Future<void> resumeProSubscription() {
    return _api.post<Map<String, dynamic>>('/subscription/pro/resume');
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

final proCatalogProvider = FutureProvider.autoDispose((ref) {
  return ref.watch(subscriptionRepositoryProvider).fetchProCatalog();
});

class ProStatusNotifier extends AutoDisposeAsyncNotifier<ProSubscriptionStatus> {
  @override
  Future<ProSubscriptionStatus> build() {
    return ref.watch(subscriptionRepositoryProvider).fetchProStatus();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(subscriptionRepositoryProvider).fetchProStatus(),
    );
  }
}

final proStatusProvider =
    AsyncNotifierProvider.autoDispose<ProStatusNotifier, ProSubscriptionStatus>(
  ProStatusNotifier.new,
);
