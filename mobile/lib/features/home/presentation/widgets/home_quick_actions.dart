import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../replacements/presentation/widgets/create_type_sheet.dart';
import '../../../shell/providers/shell_tab_index_provider.dart';
import 'home_decorations.dart';

class HomeQuickActions extends ConsumerWidget {
  const HomeQuickActions({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SizedBox(
      height: 40,
      child: ListView(
        scrollDirection: Axis.horizontal,
        clipBehavior: Clip.none,
        children: [
          _QuickActionPill(
            icon: Icons.search,
            label: 'Rechercher',
            accent: HomeDecorations.accentCoral(context),
            onTap: () => ref.read(shellTabIndexProvider.notifier).state = 1,
          ),
          const SizedBox(width: 8),
          _QuickActionPill(
            icon: Icons.add_circle_outline,
            label: 'Créer',
            accent: HomeDecorations.accentMint(context),
            onTap: () => CreateTypeSheet.show(context),
          ),
          const SizedBox(width: 8),
          _QuickActionPill(
            icon: Icons.send_outlined,
            label: 'Candidatures',
            accent: HomeDecorations.accentCoral(context),
            onTap: () => context.push('/applications'),
          ),
          const SizedBox(width: 8),
          _QuickActionPill(
            icon: Icons.notifications_outlined,
            label: 'Notifications',
            accent: HomeDecorations.accentMint(context),
            showBadge: true,
            onTap: () => ref.read(shellTabIndexProvider.notifier).state = 2,
          ),
        ],
      ),
    );
  }
}

class _QuickActionPill extends StatelessWidget {
  const _QuickActionPill({
    required this.icon,
    required this.label,
    required this.accent,
    required this.onTap,
    this.showBadge = false,
  });

  final IconData icon;
  final String label;
  final Color accent;
  final VoidCallback onTap;
  final bool showBadge;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final dark = HomeDecorations.isDark(context);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(999),
        child: Container(
          padding: const EdgeInsets.fromLTRB(6, 6, 14, 6),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: dark ? colors.primaryOutline.withValues(alpha: 0.45) : colors.border,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 26,
                    height: 26,
                    decoration: BoxDecoration(
                      color: accent.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: accent, size: 13),
                  ),
                  if (showBadge)
                    Positioned(
                      top: -1,
                      right: -1,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppColors.coral,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
