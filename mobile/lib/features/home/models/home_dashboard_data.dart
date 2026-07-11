import '../../replacements/models/replacement_item.dart';
import 'user_activity_stats.dart';

class HomeDashboardData {
  const HomeDashboardData({
    required this.stats,
    required this.recentReplacements,
  });

  final UserActivityStats stats;
  final List<ReplacementItem> recentReplacements;
}
