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
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: colors.border),
            boxShadow: [
              BoxShadow(
                color: colors.shadow,
                blurRadius: 8,
                offset: const Offset(0, 2),
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
                        Text(
                          'Remplacement du ${replacement.dateLabel}',
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if (replacement.isUrgent) ...[
                          const SizedBox(height: 6),
                          const _UrgentChip(),
                        ],
                      ],
                    ),
                  ),
                  _StatusChip(
                    label: item.statusLabel,
                    status: item.status,
                  ),
                ],
              ),
              const SizedBox(height: 10),
              if (item.patientCount != null)
                _InfoLine(
                  label: 'Patients',
                  value: item.patientCount.toString(),
                ),
              _InfoLine(
                label: 'Codes postaux',
                value: replacement.zipCodesLabel,
              ),
              if (replacement.cities.isNotEmpty)
                _InfoLine(
                  label: 'Villes',
                  value: replacement.cities.join(', '),
                ),
              if (item.appliedAt != null) ...[
                const SizedBox(height: 8),
                Text(
                  'Candidature envoyée le ${_formatDate(item.appliedAt!)}',
                  style: TextStyle(
                    color: colors.textSecondary,
                    fontSize: 12,
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

class _InfoLine extends StatelessWidget {
  const _InfoLine({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: RichText(
        text: TextSpan(
          style: TextStyle(color: colors.textPrimary, fontSize: 13),
          children: [
            TextSpan(
              text: '$label : ',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            TextSpan(text: value),
          ],
        ),
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
    final (background, foreground) = _colorsForStatus(status);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: foreground,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  static (Color, Color) _colorsForStatus(String status) {
    switch (status) {
      case 'confirmed':
      case 'chat_enabled':
        return (const Color(0xFFD1FAE5), const Color(0xFF047857));
      case 'refused':
      case 'canceled':
      case 'cancelled':
        return (const Color(0xFFFEE2E2), const Color(0xFFB91C1C));
      default:
        return (const Color(0xFFFEF3C7), const Color(0xFFB45309));
    }
  }
}

class _UrgentChip extends StatelessWidget {
  const _UrgentChip();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.coral,
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Text(
        'URGENT',
        style: TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
