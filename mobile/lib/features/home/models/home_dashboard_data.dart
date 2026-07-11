import '../../replacements/models/replacement_item.dart';

class HomeStats {
  const HomeStats({
    this.applicationsCount,
    this.acceptedCount,
    this.createdCount,
  });

  final int? applicationsCount;
  final int? acceptedCount;
  final int? createdCount;
}

class HomeDashboardData {
  const HomeDashboardData({
    required this.stats,
    required this.recentReplacements,
  });

  final HomeStats stats;
  final List<ReplacementItem> recentReplacements;
}
