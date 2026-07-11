import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_colors.dart';
import '../../models/user_activity_stats.dart';
import 'home_decorations.dart';

class HomeStatsRow extends StatelessWidget {
  const HomeStatsRow({
    super.key,
    required this.stats,
  });

  final UserActivityStats stats;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            value: _formatCount(stats.applicationsCount),
            label: 'Candidatures',
            icon: Icons.assignment_outlined,
            accent: HomeDecorations.accentCoral(context),
            onTap: () => context.push('/applications'),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _StatCard(
            value: _formatCount(stats.acceptedCount),
            label: 'Acceptées',
            icon: Icons.check_circle_outline,
            accent: HomeDecorations.accentMint(context),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _StatCard(
            value: _formatCount(stats.createdCount),
            label: 'Publiés',
            icon: Icons.campaign_outlined,
            accent: HomeDecorations.accentCoral(context),
          ),
        ),
      ],
    );
  }

  static String _formatCount(int? value) {
    if (value == null) {
      return '—';
    }
    return value.toString();
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.value,
    required this.label,
    required this.icon,
    required this.accent,
    this.onTap,
  });

  final String value;
  final String label;
  final IconData icon;
  final Color accent;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(7),
        child: Container(
          padding: const EdgeInsets.fromLTRB(10, 14, 10, 12),
          decoration: HomeDecorations.card(context, accent: accent),
          child: Column(
            children: [
              Text(
                value,
                style: TextStyle(
                  color: accent,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  height: 1,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                label,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: colors.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: accent.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: accent, size: 18),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
