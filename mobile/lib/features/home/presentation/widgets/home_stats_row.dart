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
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 13),
      decoration: HomeDecorations.card(context),
      child: Row(
        children: [
          Expanded(
            child: _StatCell(
              value: _formatCount(stats.applicationsCount),
              label: 'CANDIDATURES',
              onTap: () => context.push('/applications'),
            ),
          ),
          _StatDivider(color: colors.divider),
          Expanded(
            child: _StatCell(
              value: _formatCount(stats.acceptedCount),
              label: 'ACCEPTÉES',
            ),
          ),
          _StatDivider(color: colors.divider),
          Expanded(
            child: _StatCell(
              value: _formatCount(stats.createdCount),
              label: 'PUBLIÉS',
            ),
          ),
        ],
      ),
    );
  }

  static String _formatCount(int? value) {
    if (value == null) {
      return '—';
    }
    return value.toString();
  }
}

class _StatCell extends StatelessWidget {
  const _StatCell({
    required this.value,
    required this.label,
    this.onTap,
  });

  final String value;
  final String label;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    final content = Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: TextStyle(
            color: colors.textPrimary,
            fontSize: 19,
            fontWeight: FontWeight.w800,
            height: 1,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: colors.textSecondary,
            fontSize: 9,
            fontWeight: FontWeight.w600,
            letterSpacing: .2,
          ),
        ),
      ],
    );

    if (onTap == null) {
      return content;
    }

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 2),
          child: content,
        ),
      ),
    );
  }
}

class _StatDivider extends StatelessWidget {
  const _StatDivider({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      margin: const EdgeInsets.symmetric(vertical: 2),
      color: color,
    );
  }
}
