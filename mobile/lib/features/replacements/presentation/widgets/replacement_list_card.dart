import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../models/replacement_item.dart';
import 'mission_avatar.dart';

class ReplacementListCard extends StatelessWidget {
  const ReplacementListCard({
    super.key,
    required this.item,
    required this.onTap,
  });

  final ReplacementItem item;
  final VoidCallback onTap;

  static String? previewDescription(String raw) {
    final cleaned = raw.trim().replaceAll(RegExp(r'\s+'), ' ');
    if (cleaned.isEmpty) {
      return null;
    }
    const maxChars = 72;
    if (cleaned.length <= maxChars) {
      return cleaned;
    }
    return '${cleaned.substring(0, maxChars).trimRight()}…';
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final descriptionPreview = previewDescription(item.description);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: colors.border),
            boxShadow: [
              BoxShadow(
                color: colors.shadow,
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(width: 3, color: colors.primary),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
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
                                  ReplacementCardMetaRow(
                                    icon: Icons.location_on_outlined,
                                    text: item.zipCodesLabel,
                                  ),
                                  const SizedBox(height: 3),
                                  ReplacementCardMetaRow(
                                    icon: Icons.calendar_today_outlined,
                                    text: item.dateLabel,
                                  ),
                                ],
                              ),
                            ),
                            if (item.isUrgent) ...[
                              const SizedBox(width: 6),
                              const ReplacementUrgentBadge(),
                            ],
                          ],
                        ),
                        if (item.isBoosted) ...[
                          const SizedBox(height: 4),
                          const ReplacementBoostStars(size: 12),
                        ],
                        const SizedBox(height: 6),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  ReplacementCardMetaRow(
                                    icon: item.isMission
                                        ? Icons.school_outlined
                                        : Icons.medical_services_outlined,
                                    text: item.role,
                                    emphasize: true,
                                  ),
                                  if (descriptionPreview != null) ...[
                                    const SizedBox(height: 2),
                                    Text(
                                      descriptionPreview,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        color: colors.textSecondary,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w400,
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                            if (item.isMission) ...[
                              const SizedBox(width: 8),
                              MissionAvatar(
                                logoUrl: item.institutionLogoUrl,
                                size: 24,
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ReplacementCardMetaRow extends StatelessWidget {
  const ReplacementCardMetaRow({
    super.key,
    required this.icon,
    required this.text,
    this.emphasize = false,
  });

  final IconData icon;
  final String text;
  final bool emphasize;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final color =
        emphasize ? colors.textPrimary : colors.textSecondary;

    return Row(
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              color: color,
              fontSize: emphasize ? 13 : 12,
              fontWeight: emphasize ? FontWeight.w500 : FontWeight.w400,
            ),
          ),
        ),
      ],
    );
  }
}

class ReplacementBoostStars extends StatelessWidget {
  const ReplacementBoostStars({super.key, this.size = 18});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(
        5,
        (_) => Icon(Icons.star, size: size, color: AppColors.boostGold),
      ),
    );
  }
}

class ReplacementUrgentBadge extends StatelessWidget {
  const ReplacementUrgentBadge({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.coral,
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.campaign_outlined, size: 12, color: AppColors.onCoral),
          SizedBox(width: 3),
          Text(
            'Urgent',
            style: TextStyle(
              color: AppColors.onCoral,
              fontSize: 10,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
