import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/config/app_config.dart';
import '../../../core/theme/app_colors.dart';
import '../../auth/data/auth_repository.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../data/settings_repository.dart';
import '../models/settings_models.dart';
import 'widgets/avatar_section.dart';
import 'widgets/change_password_sheet.dart';
import 'widgets/delete_account_section.dart';
import 'widgets/edit_address_sheet.dart';
import 'widgets/edit_personal_info_sheet.dart';
import 'widgets/notification_preferences_card.dart';
import 'widgets/two_factor_section.dart';
import 'widgets/zone_preferences_card.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  Map<String, dynamic>? _settings;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });
    try {
      final repository = ref.read(settingsRepositoryProvider);
      final settings = await repository.fetchSettings();
      if (mounted) setState(() => _settings = settings);
    } on ApiException catch (error) {
      if (mounted) setState(() => _errorMessage = error.message);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // update-information/update-address/update-profil don't return a reliable
  // user shape, so refetch /user (which does) instead of merging their body.
  Future<void> _refreshUser() async {
    final session = ref.read(authSessionProvider);
    if (session == null) return;
    final user = await ref.read(authRepositoryProvider).fetchCurrentUser();
    ref.read(authSessionProvider.notifier).state = session.copyWithUser(user);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final session = ref.watch(authSessionProvider);
    final config = ref.watch(appConfigProvider);
    final repository = ref.read(settingsRepositoryProvider);
    final canPop = Navigator.of(context).canPop();

    if (session == null) {
      return const SizedBox.shrink();
    }

    final user = session.user;
    final userId = int.tryParse(user['id']?.toString() ?? '');
    final isInstitution = user['type'] == 'institution';

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 20, 8),
              child: Row(
                children: [
                  if (canPop)
                    IconButton(
                      onPressed: () => context.pop(),
                      icon: Icon(Icons.arrow_back, color: colors.primary),
                    )
                  else
                    const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Paramètres',
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
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: userId == null
                  ? const SizedBox.shrink()
                  : _isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : _errorMessage != null
                          ? _ErrorState(message: _errorMessage!, onRetry: _loadSettings)
                          : _SettingsBody(
                              repository: repository,
                              userId: userId,
                              user: user,
                              isInstitution: isInstitution,
                              apiBaseUrl: config.apiBaseUrl,
                              settings: _settings ?? const {},
                              onUserChanged: _refreshUser,
                            ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SettingsBody extends ConsumerWidget {
  const _SettingsBody({
    required this.repository,
    required this.userId,
    required this.user,
    required this.isInstitution,
    required this.apiBaseUrl,
    required this.settings,
    required this.onUserChanged,
  });

  final SettingsRepository repository;
  final int userId;
  final Map<String, dynamic> user;
  final bool isInstitution;
  final String apiBaseUrl;
  final Map<String, dynamic> settings;
  final Future<void> Function() onUserChanged;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final personalInfo = PersonalInfoData.fromUser(user);
    final address = AddressData.fromUser(user);
    final notificationPrefs = NotificationPreferences.fromJson(
      settings['notification'] is Map ? Map<String, dynamic>.from(settings['notification']) : null,
    );
    final zonePrefs = ReplacementZonePreferences.fromJson(
      settings['replacement'] is Map ? Map<String, dynamic>.from(settings['replacement']) : null,
    );
    final avatarPath = user['profil_url']?.toString();
    final avatarUrl = (avatarPath == null || avatarPath.isEmpty)
        ? null
        : (avatarPath.startsWith('http') ? avatarPath : '$apiBaseUrl/storage/$avatarPath');
    final displayName = _displayNameFor(user);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
      children: [
        _SectionCard(
          colors: colors,
          child: AvatarSection(
            repository: repository,
            userId: userId,
            initialImageUrl: avatarUrl,
            displayName: displayName,
            onAvatarChanged: onUserChanged,
          ),
        ),
        const SizedBox(height: 16),
        _SectionCard(
          colors: colors,
          title: 'Informations personnelles',
          icon: Icons.badge_outlined,
          onEdit: () async {
            final saved = await showEditPersonalInfoSheet(
              context: context,
              repository: repository,
              userId: userId,
              initial: personalInfo,
              isInstitution: isInstitution,
            );
            if (saved == true) await onUserChanged();
          },
          child: _InfoRows(rows: [
            if (isInstitution && personalInfo.institutionName != null)
              ("Nom de l'institution", personalInfo.institutionName!),
            ('Nom', personalInfo.lastname),
            ('Prénom', personalInfo.firstname),
            ('Email', personalInfo.email),
            if (personalInfo.phoneNumber != null) ('Téléphone', personalInfo.phoneNumber!),
          ]),
        ),
        const SizedBox(height: 16),
        _SectionCard(
          colors: colors,
          title: 'Adresse',
          icon: Icons.map_outlined,
          onEdit: () async {
            final saved = await showEditAddressSheet(
              context: context,
              repository: repository,
              userId: userId,
              initial: address,
            );
            if (saved == true) await onUserChanged();
          },
          child: _InfoRows(rows: [
            ('Rue', address.streetAddress.isEmpty ? '-' : address.streetAddress),
            ('Ville', address.city.isEmpty ? '-' : address.city),
            ('Code postal', address.zipCode.isEmpty ? '-' : address.zipCode),
          ]),
        ),
        const SizedBox(height: 16),
        _SectionCard(
          colors: colors,
          title: 'Sécurité',
          icon: Icons.shield_outlined,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _ActionRow(
                label: 'Mot de passe',
                onTap: () => showChangePasswordSheet(
                  context: context,
                  repository: repository,
                  userId: userId,
                ),
              ),
              const Divider(height: 24),
              TwoFactorSection(
                repository: repository,
                initialEnabled: user['two_factor_enabled'] == true,
                email: personalInfo.email,
              ),
            ],
          ),
        ),
        if (!isInstitution) ...[
          const SizedBox(height: 16),
          _SectionCard(
            colors: colors,
            title: 'Préférences de zone',
            icon: Icons.travel_explore_outlined,
            child: ZonePreferencesCard(repository: repository, initial: zonePrefs),
          ),
          const SizedBox(height: 16),
          _SectionCard(
            colors: colors,
            title: 'Notifications',
            icon: Icons.notifications_outlined,
            child: NotificationPreferencesCard(repository: repository, initial: notificationPrefs),
          ),
        ],
        const SizedBox(height: 24),
        DeleteAccountSection(
          repository: repository,
          userId: userId,
          onDeleted: () async {
            await ref.read(authRepositoryProvider).logout();
          },
        ),
      ],
    );
  }
}

String _displayNameFor(Map<String, dynamic> user) {
  final fullName = user['full_name'];
  if (fullName is String && fullName.isNotEmpty) return fullName;
  final email = user['email'];
  if (email is String && email.isNotEmpty) return email;
  return 'Utilisateur';
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.colors,
    required this.child,
    this.title,
    this.icon,
    this.onEdit,
  });

  final AppPalette colors;
  final Widget child;
  final String? title;
  final IconData? icon;
  final VoidCallback? onEdit;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (title != null) ...[
            Row(
              children: [
                if (icon != null) ...[
                  Icon(icon, size: 20, color: colors.textSecondary),
                  const SizedBox(width: 10),
                ],
                Expanded(
                  child: Text(
                    title!,
                    style: TextStyle(
                      color: colors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                if (onEdit != null)
                  IconButton(
                    visualDensity: VisualDensity.compact,
                    onPressed: onEdit,
                    icon: Icon(Icons.edit_outlined, size: 18, color: colors.primary),
                  ),
              ],
            ),
            const SizedBox(height: 12),
          ],
          child,
        ],
      ),
    );
  }
}

class _InfoRows extends StatelessWidget {
  const _InfoRows({required this.rows});

  final List<(String, String)> rows;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (final (label, value) in rows)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(
              children: [
                SizedBox(
                  width: 110,
                  child: Text(label, style: TextStyle(color: colors.textSecondary, fontSize: 13)),
                ),
                Expanded(
                  child: Text(
                    value,
                    style: TextStyle(color: colors.textPrimary, fontSize: 14),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

class _ActionRow extends StatelessWidget {
  const _ActionRow({required this.label, required this.onTap});

  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            Expanded(
              child: Text(label, style: TextStyle(color: colors.textPrimary, fontSize: 14)),
            ),
            Icon(Icons.chevron_right, color: colors.textSecondary),
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(message, textAlign: TextAlign.center, style: TextStyle(color: colors.textSecondary)),
            const SizedBox(height: 16),
            OutlinedButton(onPressed: onRetry, child: const Text('Réessayer')),
          ],
        ),
      ),
    );
  }
}
