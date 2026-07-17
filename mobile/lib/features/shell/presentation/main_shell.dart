import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radii.dart';
import '../../home/presentation/home_screen.dart';
import '../../notifications/data/notifications_list_notifier.dart';
import '../../notifications/presentation/notifications_screen.dart';
import '../../profile/presentation/profile_screen.dart';
import '../../replacements/presentation/replacements_screen.dart';
import '../../replacements/presentation/widgets/create_type_sheet.dart';
import '../providers/shell_tab_index_provider.dart';

class MainShell extends ConsumerWidget {
  const MainShell({super.key});

  static const List<Widget> _pages = [
    HomeScreen(),
    ReplacementsScreen(),
    NotificationsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final currentIndex = ref.watch(shellTabIndexProvider);
    final unreadCount = ref.watch(unreadNotificationCountProvider).maybeWhen(
          data: (count) => count,
          orElse: () => 0,
        );
    final newReplacementsCount = ref.watch(newReplacementsCountProvider).maybeWhen(
          data: (count) => count,
          orElse: () => 0,
        );

    void selectTab(int index) =>
        ref.read(shellTabIndexProvider.notifier).state = index;

    return Scaffold(
      backgroundColor: colors.background,
      body: _pages[currentIndex],
      bottomNavigationBar: SafeArea(
        top: false,
        minimum: const EdgeInsets.fromLTRB(14, 0, 14, 12),
        child: SizedBox(
          height: 78,
          child: Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.bottomCenter,
            children: [
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: Container(
                  height: 64,
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(AppRadii.xl),
                    border: Border.all(color: colors.border),
                    boxShadow: [
                      BoxShadow(
                        color: colors.shadow,
                        blurRadius: 24,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _NavTab(
                              icon: Icons.dashboard_outlined,
                              activeIcon: Icons.dashboard,
                              label: 'Accueil',
                              active: currentIndex == 0,
                              onTap: () => selectTab(0),
                            ),
                            _NavTab(
                              icon: Icons.search_outlined,
                              activeIcon: Icons.search,
                              label: 'Remplacements',
                              active: currentIndex == 1,
                              badgeCount: newReplacementsCount,
                              onTap: () => selectTab(1),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 56),
                      Expanded(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _NavTab(
                              icon: Icons.notifications_outlined,
                              activeIcon: Icons.notifications,
                              label: 'Notifications',
                              active: currentIndex == 2,
                              badgeCount: unreadCount,
                              onTap: () => selectTab(2),
                            ),
                            _NavTab(
                              icon: Icons.person_outline,
                              activeIcon: Icons.person,
                              label: 'Profil',
                              active: currentIndex == 3,
                              onTap: () => selectTab(3),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                bottom: 34,
                child: _CreateFab(
                  onTap: () => CreateTypeSheet.show(context),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavTab extends StatelessWidget {
  const _NavTab({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.active,
    required this.onTap,
    this.badgeCount = 0,
  });

  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool active;
  final int badgeCount;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final color = active ? colors.primary : colors.textSecondary;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.md),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Badge(
                isLabelVisible: badgeCount > 0,
                backgroundColor: AppColors.coral,
                label: Text('$badgeCount'),
                child: Icon(active ? activeIcon : icon, color: color, size: 22),
              ),
              const SizedBox(height: 3),
              Text(
                label,
                style: TextStyle(
                  color: color,
                  fontSize: 9.5,
                  fontWeight: active ? FontWeight.w700 : FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CreateFab extends StatelessWidget {
  const _CreateFab({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: Container(
          width: 56,
          height: 56,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: colors.primary,
            border: Border.all(color: colors.background, width: 4),
            boxShadow: [
              BoxShadow(
                color: colors.primary.withValues(alpha: 0.4),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Icon(Icons.add, color: colors.onPrimary, size: 26),
        ),
      ),
    );
  }
}
