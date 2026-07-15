import 'replacement_item.dart';

class DashboardReplacementsSummary {
  const DashboardReplacementsSummary({
    required this.boostedReplacements,
    required this.recentReplacements,
    required this.missions,
    required this.replacementsTotal,
    required this.missionsTotal,
  });

  final List<ReplacementItem> boostedReplacements;
  final List<ReplacementItem> recentReplacements;
  final List<ReplacementItem> missions;
  final int replacementsTotal;
  final int missionsTotal;
}
