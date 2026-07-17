import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/theme_mode_provider.dart';
import '../../auth/data/auth_repository.dart';
import '../../auth/providers/auth_session_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(authSessionProvider);
    final themeMode = ref.watch(themeModeProvider);
    final colors = context.appColors;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final themeSubtitle = switch (themeMode) {
      ThemeMode.system => 'Système',
      ThemeMode.dark => 'Sombre',
      ThemeMode.light => 'Clair',
    };

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: _SimpleTitle(title: 'Profil', colors: colors),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  _MenuCard(
                    colors: colors,
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          session?.displayName ?? 'Utilisateur',
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (session?.user['email'] != null) ...[
                          const SizedBox(height: 8),
                          Text(
                            session!.user['email'].toString(),
                            style: TextStyle(color: colors.textSecondary),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  _MenuCard(
                    colors: colors,
                    child: _MenuTile(
                      colors: colors,
                      icon: Icons.send_outlined,
                      title: 'Mes candidatures',
                      onTap: () => context.push('/applications'),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _MenuCard(
                    colors: colors,
                    child: _MenuTile(
                      colors: colors,
                      icon: Icons.campaign_outlined,
                      nudge: const Offset(0, -1),
                      title: 'Mes remplacements',
                      onTap: () => context.push('/my-replacements'),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _MenuCard(
                    colors: colors,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 4,
                    ),
                    child: Material(
                      type: MaterialType.transparency,
                      borderRadius: BorderRadius.circular(16),
                      clipBehavior: Clip.antiAlias,
                      child: SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        secondary: SizedBox.square(
                          dimension: 24,
                          child: Center(
                            child: Icon(
                              isDark
                                  ? Icons.dark_mode_outlined
                                  : Icons.light_mode_outlined,
                              size: 22,
                              color: colors.primary,
                            ),
                          ),
                        ),
                        title: Text(
                          'Thème sombre',
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        subtitle: Text(
                          themeSubtitle,
                          style: TextStyle(
                            color: colors.textSecondary,
                            fontSize: 13,
                          ),
                        ),
                        activeThumbColor: colors.onPrimary,
                        activeTrackColor: colors.primary,
                        value: isDark,
                        onChanged: (value) {
                          ref.read(themeModeProvider.notifier).setThemeMode(
                                value ? ThemeMode.dark : ThemeMode.light,
                              );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () async {
                        await ref.read(authRepositoryProvider).logout();
                        if (context.mounted) {
                          context.go('/login');
                        }
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.coral,
                        side: const BorderSide(color: AppColors.coral),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      icon: const Icon(Icons.logout),
                      label: const Text('Se déconnecter'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MenuCard extends StatelessWidget {
  const _MenuCard({
    required this.colors,
    required this.child,
    this.padding,
  });

  final AppPalette colors;
  final Widget child;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: padding,
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(
            color: colors.shadow,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: child,
    );
  }
}

class _MenuTile extends StatelessWidget {
  const _MenuTile({
    required this.colors,
    required this.icon,
    required this.title,
    required this.onTap,
    this.angle = 0,
    this.nudge = Offset.zero,
  });

  final AppPalette colors;
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final double angle;
  final Offset nudge;

  @override
  Widget build(BuildContext context) {
    return Material(
      type: MaterialType.transparency,
      borderRadius: BorderRadius.circular(16),
      clipBehavior: Clip.antiAlias,
      child: ListTile(
        minLeadingWidth: 24,
        titleAlignment: ListTileTitleAlignment.center,
        leading: SizedBox.square(
          dimension: 24,
          child: Center(
            child: Transform.translate(
              offset: nudge,
              child: Transform.rotate(
                angle: angle,
                child: Icon(icon, size: 22, color: colors.primary),
              ),
            ),
          ),
        ),
        title: Text(
          title,
          style: TextStyle(
            color: colors.textPrimary,
            fontWeight: FontWeight.w500,
          ),
        ),
        trailing: Icon(Icons.chevron_right, color: colors.textSecondary),
        onTap: onTap,
      ),
    );
  }
}

class _SimpleTitle extends StatelessWidget {
  const _SimpleTitle({required this.title, required this.colors});

  final String title;
  final AppPalette colors;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: 48,
          height: 3,
          decoration: BoxDecoration(
            color: colors.primary,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      ],
    );
  }
}
