import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../replacements/models/replacement_item.dart';
import '../../../replacements/presentation/widgets/mission_avatar.dart';
import '../../../shell/providers/shell_tab_index_provider.dart';
import 'home_decorations.dart';
import '../../../../core/theme/app_radii.dart';

class HomeReplacementsRail extends ConsumerWidget {
  const HomeReplacementsRail({
    super.key,
    required this.items,
    required this.total,
    required this.onCardTap,
  });

  final List<ReplacementItem> items;
  final int total;
  final void Function(ReplacementItem item) onCardTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _RailHeader(
          title: 'Remplacements près de vous',
          total: total,
          onSeeAll: () => ref.read(shellTabIndexProvider.notifier).state = 1,
        ),
        const SizedBox(height: 10),
        if (items.isEmpty)
          const _RailEmpty(message: 'Aucun remplacement boosté pour le moment.')
        else
          SizedBox(
            height: 132,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemBuilder: (context, index) {
                final item = items[index];
                return _ReplacementMiniCard(
                    item: item, onTap: () => onCardTap(item));
              },
            ),
          ),
      ],
    );
  }
}

class HomeMissionsRail extends ConsumerWidget {
  const HomeMissionsRail({
    super.key,
    required this.items,
    required this.total,
    required this.onCardTap,
  });

  final List<ReplacementItem> items;
  final int total;
  final void Function(ReplacementItem item) onCardTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _RailHeader(
          title: 'Missions institutions',
          total: total,
          onSeeAll: () => ref.read(shellTabIndexProvider.notifier).state = 1,
        ),
        const SizedBox(height: 10),
        if (items.isEmpty)
          const _RailEmpty(message: 'Aucune mission ouverte pour le moment.')
        else
          SizedBox(
            height: 132,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemBuilder: (context, index) {
                final item = items[index];
                return _MissionMiniCard(
                    item: item, onTap: () => onCardTap(item));
              },
            ),
          ),
      ],
    );
  }
}

class _RailHeader extends StatelessWidget {
  const _RailHeader(
      {required this.title, required this.total, required this.onSeeAll});

  final String title;
  final int total;
  final VoidCallback onSeeAll;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Text(
              title,
              style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 15,
                  fontWeight: FontWeight.w700),
            ),
            const SizedBox(width: 6),
            Text(
              '· $total',
              style: TextStyle(
                  color: colors.textSecondary,
                  fontSize: 12,
                  fontWeight: FontWeight.w600),
            ),
          ],
        ),
        TextButton(
          onPressed: onSeeAll,
          child: Text(
            'Voir tout',
            style: TextStyle(
                color: HomeDecorations.accentMint(context),
                fontWeight: FontWeight.w600),
          ),
        ),
      ],
    );
  }
}

class _RailEmpty extends StatelessWidget {
  const _RailEmpty({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      height: 84,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: colors.divider),
      ),
      child: Text(
        message,
        style: TextStyle(color: colors.textSecondary, fontSize: 12.5),
      ),
    );
  }
}

class _ReplacementMiniCard extends StatelessWidget {
  const _ReplacementMiniCard({required this.item, required this.onTap});

  final ReplacementItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.md),
        child: Container(
          width: 158,
          padding: const EdgeInsets.all(12),
          decoration: HomeDecorations.card(
            context,
            accent: item.isUrgent ? AppColors.urgent : null,
            radius: AppRadii.md,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _MiniTypeBadge(isUrgent: item.isUrgent),
              if (item.isBoosted) ...[
                const SizedBox(height: 6),
                const _MiniBoostStars(),
              ],
              const SizedBox(height: 7),
              Text(
                item.role,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                    color: colors.textPrimary,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 2),
              Text(
                item.zipCodesLabel,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: colors.textSecondary, fontSize: 10.5),
              ),
              const Spacer(),
              Row(
                children: [
                  Icon(Icons.calendar_today_outlined,
                      size: 11, color: colors.textSecondary),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      item.dateLabel,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style:
                          TextStyle(color: colors.textSecondary, fontSize: 10),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MissionMiniCard extends StatelessWidget {
  const _MissionMiniCard({required this.item, required this.onTap});

  final ReplacementItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.md),
        child: Container(
          width: 158,
          padding: const EdgeInsets.all(12),
          decoration: HomeDecorations.card(context,
              accent: AppColors.mission, radius: AppRadii.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              MissionAvatar(logoUrl: item.institutionLogoUrl, size: 30),
              const SizedBox(height: 8),
              Text(
                item.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                    color: colors.textPrimary,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 2),
              Text(
                item.role,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: colors.textSecondary, fontSize: 10.5),
              ),
              const Spacer(),
              Row(
                children: [
                  Icon(Icons.calendar_today_outlined,
                      size: 11, color: colors.textSecondary),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      item.dateLabel,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style:
                          TextStyle(color: colors.textSecondary, fontSize: 10),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MiniTypeBadge extends StatelessWidget {
  const _MiniTypeBadge({required this.isUrgent});

  final bool isUrgent;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final background = isUrgent ? AppColors.urgent : colors.background;
    final foreground = isUrgent ? AppColors.onUrgent : colors.textSecondary;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
          color: background, borderRadius: BorderRadius.circular(AppRadii.md)),
      child: Text(
        isUrgent ? 'Urgent' : 'Classique',
        style: TextStyle(
            color: foreground,
            fontSize: 9,
            fontWeight: FontWeight.w800,
            letterSpacing: .2),
      ),
    );
  }
}

class _MiniBoostStars extends StatelessWidget {
  const _MiniBoostStars();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(
        5,
        (_) => const Icon(Icons.star, size: 10, color: AppColors.boostGold),
      ),
    );
  }
}
