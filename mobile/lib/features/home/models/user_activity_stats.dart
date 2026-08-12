/// Mirrors the nurse report payload returned by `GET /reports`
/// (`ReplacementReportService::generateNursePercentageReport`), same
/// endpoint and fields the web nurse dashboard uses.
class UserActivityStats {
  const UserActivityStats({
    this.postedCount,
    this.acceptedCount,
    this.responsesCount,
    this.referralsCount,
  });

  /// Replacements posted by the nurse this month (`me`).
  final int? postedCount;

  /// Responses accepted this month (`accepted`).
  final int? acceptedCount;

  /// Total responses this month (`total`).
  final int? responsesCount;

  /// Colleagues registered through the nurse's referral link (`referrals`).
  final int? referralsCount;

  factory UserActivityStats.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return const UserActivityStats();
    }

    return UserActivityStats(
      postedCount: _parseInt(json['me']),
      acceptedCount: _parseInt(json['accepted']),
      responsesCount: _parseInt(json['total']),
      referralsCount: _parseInt(json['referrals']),
    );
  }

  static int? _parseInt(Object? value) {
    if (value is int) {
      return value;
    }
    if (value is String) {
      return int.tryParse(value);
    }
    return null;
  }
}
