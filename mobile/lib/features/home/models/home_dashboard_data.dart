import '../../replacements/models/dashboard_replacements_summary.dart';
import 'user_activity_stats.dart';

class HomeDashboardData {
  const HomeDashboardData({
    required this.stats,
    required this.replacements,
  });

  final UserActivityStats stats;
  final DashboardReplacementsSummary replacements;
}
