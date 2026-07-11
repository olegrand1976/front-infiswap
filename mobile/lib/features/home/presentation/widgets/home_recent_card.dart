import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../replacements/models/replacement_item.dart';
import 'home_decorations.dart';

class HomeRecentCard extends StatelessWidget {
  const HomeRecentCard({
    super.key,
    required this.item,
    required this.onTap,
  });

  final ReplacementItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final title = item.isMission && item.institutionName != null
        ? item.institutionName!
        : item.role;
    final subtitle = item.isMission
        ? (item.subtitle.isNotEmpty ? item.subtitle : item.citiesLabel)
        : item.citiesLabel;
    final timeLabel = _timeLabel(item);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(7),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: HomeDecorations.card(context),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.coral.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.location_on_outlined,
                      color: AppColors.coral,
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if (subtitle.isNotEmpty) ...[
                          const SizedBox(height: 2),
                          Text(
                            subtitle,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: colors.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  if (item.isUrgent) ...[
                    const SizedBox(width: 8),
                    const _UrgentBadge(),
                  ],
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(
                    Icons.calendar_today_outlined,
                    size: 14,
                    color: colors.textSecondary,
                  ),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      item.dateLabel,
                      style: TextStyle(
                        color: colors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  if (timeLabel != null) ...[
                    Icon(
                      Icons.schedule_outlined,
                      size: 14,
                      color: colors.textSecondary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      timeLabel,
                      style: TextStyle(
                        color: colors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Text(
                    item.zipCodesLabel,
                    style: TextStyle(
                      color: colors.textSecondary,
                      fontSize: 11,
                    ),
                  ),
                  const Spacer(),
                  Icon(
                    Icons.chevron_right,
                    color: colors.textSecondary,
                    size: 20,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  static String? _timeLabel(ReplacementItem item) {
    if (item.periods.isEmpty) {
      return null;
    }
    final period = item.periods.first;
    final parts = <String>[];
    if (period.morning != null && period.morning!.isNotEmpty) {
      parts.add(period.morning!);
    }
    if (period.evening != null && period.evening!.isNotEmpty) {
      parts.add(period.evening!);
    }
    if (parts.isEmpty) {
      return null;
    }
    return parts.join(' · ');
  }
}

extension on ReplacementItem {
  String get citiesLabel {
    if (cities.isEmpty) {
      return zipCodesLabel;
    }
    return cities.join(', ');
  }
}

class _UrgentBadge extends StatelessWidget {
  const _UrgentBadge();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.coral,
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Text(
        'Urgent',
        style: TextStyle(
          color: Colors.white,
          fontSize: 10,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
