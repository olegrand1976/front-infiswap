import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../models/application_item.dart';

class ApplicationCard extends StatelessWidget {
  const ApplicationCard({
    super.key,
    required this.item,
    required this.onTap,
  });

  final ApplicationItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final replacement = item.replacement;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(13),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: colors.divider),
            boxShadow: [
              BoxShadow(
                color: colors.shadow,
                blurRadius: 14,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _TypeBadge(isUrgent: replacement.isUrgent),
                        const SizedBox(height: 8),
                        Text(
                          'Remplacement du ${replacement.dateLabel}',
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 13.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Icon(
                              Icons.pin_drop_outlined,
                              size: 12,
                              color: colors.primary,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                [
                                  replacement.zipCodesLabel,
                                  if (replacement.cities.isNotEmpty)
                                    replacement.cities.join(', '),
                                ].join(' · '),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: colors.textSecondary,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  _StatusChip(label: item.statusLabel, status: item.status),
                ],
              ),
              if (item.patientCount != null) ...[
                const SizedBox(height: 9),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 8),
                  decoration: BoxDecoration(
                    border: Border(top: BorderSide(color: colors.divider)),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.groups_outlined,
                        size: 12,
                        color: colors.primary,
                      ),
                      const SizedBox(width: 5),
                      Text(
                        '${item.patientCount} patient${item.patientCount! > 1 ? 's' : ''}',
                        style: TextStyle(
                          color: colors.textPrimary,
                          fontSize: 10.5,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              if (item.appliedAt != null) ...[
                const SizedBox(height: 6),
                Text(
                  'Envoyée le ${_formatDate(item.appliedAt!)}',
                  style: TextStyle(
                    color: colors.textSecondary,
                    fontSize: 10,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  static String _formatDate(DateTime date) {
    const months = [
      'janv.',
      'févr.',
      'mars',
      'avr.',
      'mai',
      'juin',
      'juil.',
      'août',
      'sept.',
      'oct.',
      'nov.',
      'déc.',
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }
}

class _TypeBadge extends StatelessWidget {
  const _TypeBadge({required this.isUrgent});

  final bool isUrgent;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final background = isUrgent ? AppColors.urgent : colors.background;
    final foreground = isUrgent ? AppColors.onUrgent : colors.textSecondary;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(7)),
      child: Text(
        isUrgent ? 'Urgent' : 'Classique',
        style: TextStyle(color: foreground, fontSize: 9, fontWeight: FontWeight.w800, letterSpacing: .2),
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  const _StatusChip({required this.label, required this.status});

  final String label;
  final String status;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final (background, foreground) = switch (applicationStatusBucket(status)) {
      ApplicationStatusBucket.success => (colors.successBg, colors.successFg),
      ApplicationStatusBucket.danger => (colors.dangerBg, colors.dangerFg),
      ApplicationStatusBucket.pending => (colors.pendingBg, colors.pendingFg),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: foreground,
          fontSize: 9.5,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
