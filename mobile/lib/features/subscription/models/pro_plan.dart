/// A subscribable Infiswap Premium plan, as returned by
/// `GET /subscription/pro/catalog` and `GET /subscription/pro/status`
/// (`ProSubscriptionService::formatPlan`).
class ProPlan {
  const ProPlan({
    required this.id,
    required this.lookupKey,
    required this.name,
    required this.amount,
    required this.currency,
    required this.interval,
    required this.intervalCount,
    this.label,
  });

  final int id;
  final String lookupKey;
  final String name;
  final double amount;
  final String currency;
  final String interval;
  final int intervalCount;
  final String? label;

  String get currencySymbol => currency.toLowerCase() == 'gbp' ? '£' : '€';

  String get formattedAmount {
    final value = amount.toStringAsFixed(2).replaceAll('.', ',');
    return '$value $currencySymbol';
  }

  String get cycleLabel {
    if (interval == 'year') {
      return intervalCount > 1 ? '$intervalCount ans' : 'an';
    }
    return intervalCount > 1 ? '$intervalCount mois' : 'mois';
  }

  factory ProPlan.fromJson(Map<String, dynamic> json) {
    return ProPlan(
      id: _parseInt(json['id']) ?? 0,
      lookupKey: json['lookup_key']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Infiswap Premium',
      amount: _parseDouble(json['amount']) ?? 0,
      currency: json['currency']?.toString() ?? 'eur',
      interval: json['interval']?.toString() ?? 'month',
      intervalCount: _parseInt(json['interval_count']) ?? 1,
      label: json['label']?.toString(),
    );
  }

  static int? _parseInt(Object? value) {
    if (value is int) return value;
    if (value is String) return int.tryParse(value);
    return null;
  }

  static double? _parseDouble(Object? value) {
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }
}
