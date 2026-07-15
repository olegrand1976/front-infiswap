import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../home/presentation/home_screen.dart';
import '../../notifications/presentation/notifications_screen.dart';
import '../../profile/presentation/profile_screen.dart';
import '../../replacements/presentation/replacements_screen.dart';
import '../providers/shell_tab_index_provider.dart';

class MainShell extends ConsumerWidget {
  const MainShell({super.key});

  static const int _notificationCount = 3;

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

    return Scaffold(
      backgroundColor: colors.background,
      body: _pages[currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(color: colors.primary, width: 1),
          ),
        ),
        child: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          backgroundColor: colors.card,
          selectedItemColor: colors.primary,
          unselectedItemColor: colors.textSecondary,
          selectedFontSize: 12,
          unselectedFontSize: 12,
          currentIndex: currentIndex,
          onTap: (index) =>
              ref.read(shellTabIndexProvider.notifier).state = index,
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard),
              label: 'Tableau de Bord',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.search_outlined),
              activeIcon: Icon(Icons.search),
              label: 'Remplacements',
            ),
            const BottomNavigationBarItem(
              icon: Badge(
                isLabelVisible: _notificationCount > 0,
                backgroundColor: AppColors.coral,
                label: Text('$_notificationCount'),
                child: Icon(Icons.notifications_outlined),
              ),
              activeIcon: Badge(
                isLabelVisible: _notificationCount > 0,
                backgroundColor: AppColors.coral,
                label: Text('$_notificationCount'),
                child: Icon(Icons.notifications),
              ),
              label: 'Notifications',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profil',
            ),
          ],
        ),
      ),
    );
  }
}
