class AccessPlan {
  const AccessPlan({
    required this.amount,
    required this.currency,
  });

  final double amount;
  final String currency;

  String get currencySymbol => currency.toLowerCase() == 'gbp' ? '£' : '€';

  /// Format à la française (virgule) — le web affiche "9.90 €" avec un
  /// point car il réinjecte le decimal string du backend tel quel.
  String get formattedAmount {
    final value = amount.toStringAsFixed(2).replaceAll('.', ',');
    return '$value $currencySymbol';
  }

  factory AccessPlan.fromJson(Map<String, dynamic> json) {
    final raw = json['live_amount'] ?? json['amount'];
    final amount = switch (raw) {
      num value => value.toDouble(),
      String value => double.tryParse(value) ?? 0,
      _ => 0.0,
    };
    return AccessPlan(
      amount: amount,
      currency: json['currency']?.toString() ?? 'eur',
    );
  }
}
