import 'pro_plan.dart';

/// `GET /subscription/pro/status` (`ProSubscriptionService::status`).
class ProSubscriptionStatus {
  const ProSubscriptionStatus({
    required this.isPremium,
    required this.status,
    required this.subscription,
    required this.boostCredit,
  });

  final bool isPremium;
  final String status;
  final ProSubscriptionDetails? subscription;
  final BoostCreditStatus boostCredit;

  factory ProSubscriptionStatus.fromJson(Map<String, dynamic> json) {
    final rawSubscription = json['subscription'];
    return ProSubscriptionStatus(
      isPremium: json['is_premium'] == true,
      status: json['status']?.toString() ?? 'none',
      subscription: rawSubscription is Map
          ? ProSubscriptionDetails.fromJson(
              rawSubscription.map((key, value) => MapEntry(key.toString(), value)),
            )
          : null,
      boostCredit: BoostCreditStatus.fromJson(
        json['boost_credit'] is Map
            ? (json['boost_credit'] as Map)
                .map((key, value) => MapEntry(key.toString(), value))
            : const {},
      ),
    );
  }
}

class ProSubscriptionDetails {
  const ProSubscriptionDetails({
    required this.onGracePeriod,
    required this.cancelled,
    required this.endsAt,
    required this.plan,
  });

  final bool onGracePeriod;
  final bool cancelled;
  final DateTime? endsAt;
  final ProPlan? plan;

  factory ProSubscriptionDetails.fromJson(Map<String, dynamic> json) {
    final rawPlan = json['plan'];
    return ProSubscriptionDetails(
      onGracePeriod: json['on_grace_period'] == true,
      cancelled: json['cancelled'] == true,
      endsAt: DateTime.tryParse(json['ends_at']?.toString() ?? ''),
      plan: rawPlan is Map
          ? ProPlan.fromJson(rawPlan.map((key, value) => MapEntry(key.toString(), value)))
          : null,
    );
  }
}

class BoostCreditStatus {
  const BoostCreditStatus({
    required this.available,
    required this.durationDays,
    required this.nextCreditAt,
  });

  final bool available;
  final int durationDays;
  final DateTime? nextCreditAt;

  factory BoostCreditStatus.fromJson(Map<String, dynamic> json) {
    return BoostCreditStatus(
      available: json['available'] == true,
      durationDays: json['duration_days'] is int ? json['duration_days'] as int : 7,
      nextCreditAt: DateTime.tryParse(json['next_credit_at']?.toString() ?? ''),
    );
  }
}
