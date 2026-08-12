import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';
import '../../models/user_activity_stats.dart';

class HomeStatsRow extends StatelessWidget {
  const HomeStatsRow({
    super.key,
    required this.stats,
  });

  final UserActivityStats stats;

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      childAspectRatio: 1.85,
      children: [
        _StatCard(
          icon: Icons.send_outlined,
          value: stats.postedCount,
          label: 'POSTÉS (MOIS)',
          gradient: [AppColors.coral, AppColors.coral.withValues(alpha: .75)],
        ),
        _StatCard(
          icon: Icons.check_circle_outline,
          value: stats.acceptedCount,
          label: 'ACCEPTÉS (MOIS)',
          gradient: const [Color(0xFF059669), Color(0xFF047857)],
        ),
        _StatCard(
          icon: Icons.forum_outlined,
          value: stats.responsesCount,
          label: 'RÉPONSES (MOIS)',
          gradient: const [Color(0xFF7C3AED), AppColors.mission],
        ),
        _StatCard(
          icon: Icons.people_outline,
          value: stats.referralsCount,
          label: 'PARRAINAGES',
          gradient: const [AppColors.boostGold, Color(0xFFD97706)],
          onDark: true,
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.gradient,
    this.onDark = false,
  });

  final IconData icon;
  final int? value;
  final String label;
  final List<Color> gradient;
  final bool onDark;

  @override
  Widget build(BuildContext context) {
    final foreground = onDark ? const Color(0xFF3A2405) : Colors.white;

    return Container(
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: gradient,
        ),
        borderRadius: BorderRadius.circular(AppRadii.lg),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: foreground.withValues(alpha: .18),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: foreground, size: 13),
          ),
          const SizedBox(height: 7),
          Center(
            child: Text(
              value?.toString() ?? '—',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: foreground,
                fontSize: 25,
                fontWeight: FontWeight.w800,
                height: 1,
              ),
            ),
          ),
          const SizedBox(height: 3),
          Center(
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: foreground.withValues(alpha: .82),
                fontSize: 9,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
