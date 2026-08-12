class BoostPlan {
  const BoostPlan({
    required this.id,
    required this.amount,
    required this.currency,
    this.durationDays,
    this.name,
  });

  final int id;
  final double amount;
  final String currency;
  final int? durationDays;
  final String? name;

  String get currencySymbol => currency.toLowerCase() == 'gbp' ? '£' : '€';

  String get formattedAmount {
    final value = amount.toStringAsFixed(2).replaceAll('.', ',');
    return '$value $currencySymbol';
  }

  String get durationLabel {
    if (durationDays == null) {
      return name ?? 'Mise en avant';
    }
    return durationDays == 1 ? '1 jour' : '$durationDays jours';
  }

  factory BoostPlan.fromJson(Map<String, dynamic> json) {
    final rawAmount = json['live_amount'] ?? json['amount'];
    final amount = switch (rawAmount) {
      num value => value.toDouble(),
      String value => double.tryParse(value) ?? 0,
      _ => 0.0,
    };
    final rawId = json['id'];
    final id = switch (rawId) {
      int value => value,
      String value => int.tryParse(value) ?? 0,
      _ => 0,
    };
    final rawDuration = json['duration_days'];
    final durationDays = switch (rawDuration) {
      int value => value,
      String value => int.tryParse(value),
      _ => null,
    };
    return BoostPlan(
      id: id,
      amount: amount,
      currency: json['currency']?.toString() ?? 'eur',
      durationDays: durationDays,
      name: json['name']?.toString(),
    );
  }
}
