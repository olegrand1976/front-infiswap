class ReplacementItem {
  const ReplacementItem({
    required this.id,
    required this.zipCodes,
    required this.cities,
    required this.dateLabel,
    required this.title,
    required this.subtitle,
    required this.role,
    required this.description,
    required this.careTypes,
    required this.periods,
    this.isUrgent = false,
    this.isBoosted = false,
    this.isMission = false,
    this.institutionName,
    this.institutionLogoUrl,
  });

  final String id;
  final List<String> zipCodes;
  final List<String> cities;
  final String dateLabel;
  final String title;
  final String subtitle;
  final String role;
  final String description;
  final List<String> careTypes;
  final List<ReplacementPeriod> periods;
  final bool isUrgent;
  final bool isBoosted;
  final bool isMission;
  final String? institutionName;
  final String? institutionLogoUrl;

  /// Affichage liste : codes postaux uniquement.
  String get zipCodesLabel {
    if (zipCodes.isEmpty) {
      return 'CP non précisé';
    }
    return zipCodes.join(', ');
  }
}

class ReplacementPeriod {
  const ReplacementPeriod({
    required this.dateLabel,
    this.morning,
    this.evening,
  });

  final String dateLabel;
  final String? morning;
  final String? evening;
}
