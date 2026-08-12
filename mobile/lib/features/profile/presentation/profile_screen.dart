import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/config/app_config.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/theme_mode_provider.dart';
import '../../auth/data/auth_repository.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../../replacements/presentation/create_classic_screen.dart';
import '../../replacements/presentation/create_immediate_screen.dart';
import '../../replacements/presentation/my_replacements_screen.dart';
import '../../settings/data/settings_repository.dart';
import '../../settings/presentation/widgets/avatar_section.dart';
import '../../shell/providers/shell_tab_index_provider.dart';

/// No app-bar title here on purpose — the avatar already identifies the
/// screen, and the menu below mirrors the web sidebar for nurses.
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

    if (session == null) {
      return Scaffold(backgroundColor: colors.background);
    }

    final user = session.user;
    final userId = int.tryParse(user['id']?.toString() ?? '');
    final apiBaseUrl = ref.watch(appConfigProvider).apiBaseUrl;
    final avatarPath = user['profil_url']?.toString();
    final avatarUrl = (avatarPath == null || avatarPath.isEmpty)
        ? null
        : (avatarPath.startsWith('http') ? avatarPath : '$apiBaseUrl/storage/$avatarPath');

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
          children: [
            if (userId != null)
              AvatarSection(
                repository: ref.read(settingsRepositoryProvider),
                userId: userId,
                initialImageUrl: avatarUrl,
                displayName: session.displayName ?? 'Utilisateur',
                subtitle: user['email']?.toString() ?? '',
                onAvatarChanged: () => _refreshUser(ref),
              ),
            const SizedBox(height: 20),
            const _GroupLabel('Remplacements'),
            _MenuGroup(children: [
              _MenuRow(
                icon: Icons.search,
                color: AppColors.coral,
                label: 'Trouver un remplacement',
                onTap: () => ref.read(shellTabIndexProvider.notifier).state = 1,
              ),
              _MenuRow(
                icon: Icons.bolt_outlined,
                color: const Color(0xFFB45309),
                label: 'Remplacement rapide',
                onTap: () => _push(context, const CreateImmediateScreen()),
              ),
              _MenuRow(
                icon: Icons.person_add_alt_outlined,
                color: const Color(0xFF059669),
                label: 'Me faire remplacer',
                onTap: () => _push(context, const CreateClassicScreen()),
              ),
              _MenuRow(
                icon: Icons.list_alt_outlined,
                color: AppColors.mission,
                label: 'Mes remplacements',
                onTap: () => _push(context, const MyReplacementsScreen()),
              ),
              const _MenuRow(
                icon: Icons.forum_outlined,
                color: AppColors.mission,
                label: 'Mes réponses',
                soon: true,
              ),
              _MenuRow(
                icon: Icons.send_outlined,
                color: AppColors.coral,
                label: 'Mes candidatures',
                onTap: () => context.push('/applications'),
              ),
            ]),
            const SizedBox(height: 20),
            const _GroupLabel('Réseau'),
            _MenuGroup(children: [
              _MenuRow(
                icon: Icons.map_outlined,
                color: AppColors.mintDark,
                label: 'Carte des infirmières',
                onTap: () {},
              ),
              _MenuRow(
                icon: Icons.groups_outlined,
                color: AppColors.mission,
                label: 'Binômes',
                onTap: () {},
              ),
              _MenuRow(
                icon: Icons.hub_outlined,
                color: colors.secondary,
                label: 'Mon réseau',
                onTap: () {},
              ),
            ]),
            const SizedBox(height: 20),
            const _GroupLabel('Compte'),
            _MenuGroup(children: [
              const _MenuRow(
                icon: Icons.workspace_premium_outlined,
                color: AppColors.boostGold,
                label: 'Infiswap Premium',
                soon: true,
              ),
              _MenuRow(
                icon: Icons.settings_outlined,
                color: colors.textSecondary,
                label: 'Paramètres',
                onTap: () => context.push('/settings'),
              ),
            ]),
            const SizedBox(height: 20),
            const _GroupLabel('Apparence'),
            _MenuGroup(children: [
              _ThemeToggleRow(
                isDark: isDark,
                subtitle: themeSubtitle,
                onChanged: (value) => ref
                    .read(themeModeProvider.notifier)
                    .setThemeMode(value ? ThemeMode.dark : ThemeMode.light),
              ),
            ]),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  await ref.read(authRepositoryProvider).logout();
                  if (context.mounted) context.go('/login');
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.coral,
                  side: const BorderSide(color: AppColors.coral, width: 1.5),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                icon: const Icon(Icons.logout, size: 17),
                label: const Text('Se déconnecter', style: TextStyle(fontSize: 12.5)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

void _push(BuildContext context, Widget screen) {
  Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => screen));
}

Future<void> _refreshUser(WidgetRef ref) async {
  final session = ref.read(authSessionProvider);
  if (session == null) return;
  final user = await ref.read(authRepositoryProvider).fetchCurrentUser();
  ref.read(authSessionProvider.notifier).state = session.copyWithUser(user);
}

class _GroupLabel extends StatelessWidget {
  const _GroupLabel(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.fromLTRB(2, 0, 2, 7),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          color: colors.textSecondary,
          fontSize: 10.5,
          fontWeight: FontWeight.w700,
          letterSpacing: .5,
        ),
      ),
    );
  }
}

class _MenuGroup extends StatelessWidget {
  const _MenuGroup({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3)),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < children.length; i++) ...[
            if (i > 0) Divider(height: 1, indent: 13, color: colors.divider),
            children[i],
          ],
        ],
      ),
    );
  }
}

/// A tappable row. When [soon] is true it's shown dimmed with a
/// "Bientôt" tag instead of a chevron — for sidebar items that don't
/// have a mobile screen yet.
class _MenuRow extends StatelessWidget {
  const _MenuRow({
    required this.icon,
    required this.color,
    required this.label,
    this.onTap,
    this.soon = false,
  });

  final IconData icon;
  final Color color;
  final String label;
  final VoidCallback? onTap;
  final bool soon;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: soon ? null : onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 11),
          child: Row(
            children: [
              Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: soon ? colors.divider : color,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, size: 13, color: soon ? colors.textSecondary : Colors.white),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    color: soon ? colors.textSecondary : colors.textPrimary,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              if (soon)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: colors.divider,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    'Bientôt',
                    style: TextStyle(
                      color: colors.textSecondary,
                      fontSize: 8.5,
                      fontWeight: FontWeight.w800,
                      letterSpacing: .2,
                    ),
                  ),
                )
              else
                Icon(Icons.chevron_right, size: 18, color: colors.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}

class _ThemeToggleRow extends StatelessWidget {
  const _ThemeToggleRow({
    required this.isDark,
    required this.subtitle,
    required this.onChanged,
  });

  final bool isDark;
  final String subtitle;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 7),
      child: Row(
        children: [
          Container(
            width: 26,
            height: 26,
            decoration: BoxDecoration(
              color: colors.textSecondary,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              isDark ? Icons.dark_mode_outlined : Icons.light_mode_outlined,
              size: 13,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Thème sombre',
                  style: TextStyle(color: colors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600),
                ),
                Text(subtitle, style: TextStyle(color: colors.textSecondary, fontSize: 11)),
              ],
            ),
          ),
          Switch(
            value: isDark,
            onChanged: onChanged,
            activeThumbColor: colors.onPrimary,
            activeTrackColor: colors.primary,
          ),
        ],
      ),
    );
  }
}
