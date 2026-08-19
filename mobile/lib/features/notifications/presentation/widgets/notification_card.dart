import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/date_time_format.dart';
import '../../../../core/widgets/skeleton_box.dart';
import '../../models/notification_item.dart';
import '../../../../core/theme/app_radii.dart';

/// Mirrors [NotificationCard]'s shape — shown while the list is loading.
class NotificationCardSkeleton extends StatelessWidget {
  const NotificationCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: colors.divider),
        boxShadow: [
          BoxShadow(color: colors.shadow, blurRadius: 14, offset: const Offset(0, 6)),
        ],
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SkeletonBox(width: 36, height: 36, radius: 18),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SkeletonBox(width: 160, height: 12),
                SizedBox(height: 6),
                SkeletonBox(width: 210, height: 10),
                SizedBox(height: 4),
                SkeletonBox(width: 120, height: 10),
                SizedBox(height: 7),
                SkeletonBox(width: 64, height: 9),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class NotificationCard extends StatelessWidget {
  const NotificationCard({
    super.key,
    required this.item,
    required this.onTap,
  });

  final NotificationItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final content = notificationContentFor(item);
    final isUnread = !item.isRead;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.md),
        child: Container(
          padding: const EdgeInsets.all(13),
          decoration: BoxDecoration(
            color: isUnread ? colors.primaryMuted : colors.card,
            borderRadius: BorderRadius.circular(AppRadii.md),
            border: Border.all(
              color: isUnread ? colors.primaryOutline : colors.divider,
            ),
            boxShadow: [
              BoxShadow(
                color: colors.shadow,
                blurRadius: 14,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: isUnread ? colors.card : colors.background,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  notificationIconFor(item.type),
                  size: 18,
                  color: isUnread ? colors.primary : colors.textSecondary,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      content.title,
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 13.5,
                        fontWeight: isUnread ? FontWeight.w800 : FontWeight.w600,
                      ),
                    ),
                    if (content.body.isNotEmpty) ...[
                      const SizedBox(height: 3),
                      Text(
                        content.body,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: colors.textSecondary,
                          fontSize: 12,
                          height: 1.35,
                        ),
                      ),
                    ],
                    const SizedBox(height: 6),
                    Text(
                      formatDateDmy(item.createdAt),
                      style: TextStyle(color: colors.textSecondary, fontSize: 10.5),
                    ),
                  ],
                ),
              ),
              if (isUnread) ...[
                const SizedBox(width: 8),
                Container(
                  width: 8,
                  height: 8,
                  margin: const EdgeInsets.only(top: 4),
                  decoration: const BoxDecoration(
                    color: AppColors.coral,
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
