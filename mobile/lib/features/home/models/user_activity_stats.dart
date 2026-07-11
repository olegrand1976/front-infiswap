class UserActivityStats {
  const UserActivityStats({
    this.applicationsCount,
    this.acceptedCount,
    this.createdCount,
  });

  final int? applicationsCount;
  final int? acceptedCount;
  final int? createdCount;

  factory UserActivityStats.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return const UserActivityStats();
    }

    return UserActivityStats(
      applicationsCount: _parseInt(json['placements_made']),
      acceptedCount: _parseInt(json['placements_accepted']),
      createdCount: _parseInt(json['replacements_created']),
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
