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
import 'widgets/edit_text_field_sheet.dart';
import 'widgets/notification_preferences_card.dart';
import 'widgets/select_option_sheet.dart';
import 'widgets/settings_sheet_scaffold.dart';
import 'widgets/two_factor_section.dart';
import 'widgets/zone_preferences_card.dart';

const _genderOptions = <(String, String)>[
  ('M', 'Homme'),
  ('F', 'Femme'),
  ('X', 'X'),
];
const _genderLabels = {'M': 'Homme', 'F': 'Femme', 'X': 'X'};

const _professionalCategoryOptions = <(String, String)>[
  ('salaried', 'Salarié(e)'),
  ('independent', 'Indépendant(e)'),
];
const _professionalCategoryLabels = {
  'salaried': 'Salarié(e)',
  'independent': 'Indépendant(e)',
};

const _countryOptions = <(String, String)>[
  ('be', 'Belgique'),
  ('fr', 'France'),
];
const _countryLabels = {'be': 'Belgique', 'fr': 'France'};

const _workingAtOptions = <(String, String)>[
  ('Belgique', 'Belgique'),
  ('France', 'France'),
];

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
                    child: Text(
                      'Paramètres',
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
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

    Future<void> saveInformation() =>
        repository.updateInformation(userId: userId, data: personalInfo).then((_) => onUserChanged());
    Future<void> saveAddress() =>
        repository.updateAddress(userId: userId, data: address).then((_) => onUserChanged());

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
      children: [
        AvatarSection(
          repository: repository,
          userId: userId,
          initialImageUrl: avatarUrl,
          displayName: displayName,
          subtitle: personalInfo.email,
          onAvatarChanged: onUserChanged,
        ),
        const SizedBox(height: 28),
        const _SectionLabel('Compte'),
        _SettingsGroup(children: [
          if (isInstitution && personalInfo.institutionName != null)
            _SettingsRow(label: "Nom de l'institution", value: personalInfo.institutionName!),
          _SettingsRow(
            label: 'Nom',
            value: personalInfo.lastname,
            onTap: () => _editTextRow(
              context: context,
              title: 'Nom',
              initialValue: personalInfo.lastname,
              onSave: (value) async {
                personalInfo.lastname = value;
                await saveInformation();
              },
            ),
          ),
          _SettingsRow(
            label: 'Prénom',
            value: personalInfo.firstname,
            onTap: () => _editTextRow(
              context: context,
              title: 'Prénom',
              initialValue: personalInfo.firstname,
              onSave: (value) async {
                personalInfo.firstname = value;
                await saveInformation();
              },
            ),
          ),
          _SettingsRow(
            label: 'Date de naissance',
            value: personalInfo.dateOfBirth != null ? _formatDate(personalInfo.dateOfBirth!) : '-',
            onTap: () async {
              final now = DateTime.now();
              final picked = await showDatePicker(
                context: context,
                initialDate: personalInfo.dateOfBirth ?? DateTime(now.year - 30),
                firstDate: DateTime(1900),
                lastDate: now,
              );
              if (picked == null || !context.mounted) return;
              await _runSave(context, () async {
                personalInfo.dateOfBirth = picked;
                await saveInformation();
              });
            },
          ),
          _SettingsRow(
            label: 'Email',
            value: personalInfo.email,
            onTap: () => _editTextRow(
              context: context,
              title: 'Email',
              initialValue: personalInfo.email,
              keyboardType: TextInputType.emailAddress,
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'Champ requis';
                if (!v.contains('@')) return 'Email invalide';
                return null;
              },
              onSave: (value) async {
                personalInfo.email = value;
                await saveInformation();
              },
            ),
          ),
          _SettingsRow(
            label: "N° d'identification",
            value: personalInfo.identifierNumber ?? '-',
            onTap: () => _editTextRow(
              context: context,
              title: "Numéro d'identification",
              initialValue: personalInfo.identifierNumber ?? '',
              required: false,
              onSave: (value) async {
                personalInfo.identifierNumber = value.isEmpty ? null : value;
                await saveInformation();
              },
            ),
          ),
          _SettingsRow(
            label: 'Téléphone',
            value: personalInfo.phoneNumber ?? '-',
            onTap: () => _editTextRow(
              context: context,
              title: 'Téléphone',
              initialValue: personalInfo.phoneNumber ?? '',
              keyboardType: TextInputType.phone,
              required: false,
              onSave: (value) async {
                personalInfo.phoneNumber = value.isEmpty ? null : value;
                await saveInformation();
              },
            ),
          ),
          _SettingsRow(
            label: 'Sexe',
            value: _genderLabels[personalInfo.gender] ?? '-',
            onTap: () => _editSelectRow<String>(
              context: context,
              title: 'Sexe',
              options: _genderOptions,
              initial: personalInfo.gender,
              onSave: (value) async {
                personalInfo.gender = value;
                await saveInformation();
              },
            ),
          ),
          if (!isInstitution)
            _SettingsRow(
              label: 'Catégorie pro.',
              value: _professionalCategoryLabels[personalInfo.professionalCategory] ?? '-',
              onTap: () => _editSelectRow<String>(
                context: context,
                title: 'Catégorie professionnelle',
                options: _professionalCategoryOptions,
                initial: personalInfo.professionalCategory,
                onSave: (value) async {
                  personalInfo.professionalCategory = value;
                  await saveInformation();
                },
              ),
            ),
        ]),
        const SizedBox(height: 24),
        const _SectionLabel('Adresse'),
        _SettingsGroup(children: [
          _SettingsRow(
            label: 'Rue',
            value: address.streetAddress.isEmpty ? '-' : address.streetAddress,
            onTap: () => _editTextRow(
              context: context,
              title: 'Rue',
              initialValue: address.streetAddress,
              onSave: (value) async {
                address.streetAddress = value;
                await saveAddress();
              },
            ),
          ),
          _SettingsRow(
            label: 'Ville',
            value: address.city.isEmpty ? '-' : address.city,
            onTap: () => _editTextRow(
              context: context,
              title: 'Ville',
              initialValue: address.city,
              onSave: (value) async {
                address.city = value;
                await saveAddress();
              },
            ),
          ),
          _SettingsRow(
            label: 'Pays',
            value: _countryLabels[address.country] ?? '-',
            onTap: () => _editSelectRow<String>(
              context: context,
              title: 'Pays',
              options: _countryOptions,
              initial: address.country,
              onSave: (value) async {
                address.country = value;
                await saveAddress();
              },
            ),
          ),
          _SettingsRow(
            label: 'Pays de travail',
            value: address.workingAt ?? '-',
            onTap: () => _editSelectRow<String>(
              context: context,
              title: 'Pays de travail',
              options: _workingAtOptions,
              initial: address.workingAt,
              onSave: (value) async {
                address.workingAt = value;
                await saveAddress();
              },
            ),
          ),
          _SettingsRow(
            label: 'Code postal',
            value: address.zipCode.isEmpty ? '-' : address.zipCode,
            onTap: () => _editTextRow(
              context: context,
              title: 'Code postal',
              initialValue: address.zipCode,
              onSave: (value) async {
                address.zipCode = value;
                await saveAddress();
              },
            ),
          ),
          _SettingsRow(
            label: 'Complément',
            value: address.additionalInfo ?? '-',
            onTap: () => _editTextRow(
              context: context,
              title: 'Complément',
              initialValue: address.additionalInfo ?? '',
              required: false,
              onSave: (value) async {
                address.additionalInfo = value.isEmpty ? null : value;
                await saveAddress();
              },
            ),
          ),
        ]),
        const SizedBox(height: 24),
        const _SectionLabel('Sécurité'),
        _SettingsGroup(children: [
          _SettingsRow(
            label: 'Mot de passe',
            onTap: () => showChangePasswordSheet(
              context: context,
              repository: repository,
              userId: userId,
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TwoFactorSection(
              repository: repository,
              initialEnabled: user['two_factor_enabled'] == true,
              email: personalInfo.email,
            ),
          ),
        ]),
        if (!isInstitution) ...[
          const SizedBox(height: 24),
          const _SectionLabel('Préférences de zone'),
          _SettingsGroup(children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: ZonePreferencesCard(repository: repository, initial: zonePrefs),
            ),
          ]),
          const SizedBox(height: 24),
          const _SectionLabel('Notifications'),
          _SettingsGroup(children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: NotificationPreferencesCard(repository: repository, initial: notificationPrefs),
            ),
          ]),
        ],
        const SizedBox(height: 24),
        const _SectionLabel('Compte'),
        _SettingsGroup(children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: DeleteAccountSection(
              repository: repository,
              userId: userId,
              onDeleted: () async {
                await ref.read(authRepositoryProvider).logout();
              },
            ),
          ),
        ]),
      ],
    );
  }
}

Future<void> _editTextRow({
  required BuildContext context,
  required String title,
  required String initialValue,
  TextInputType? keyboardType,
  bool required = true,
  String? Function(String?)? validator,
  required Future<void> Function(String value) onSave,
}) async {
  final value = await showEditTextFieldSheet(
    context: context,
    title: title,
    initialValue: initialValue,
    keyboardType: keyboardType,
    required: required,
    validator: validator,
  );
  if (value == null || !context.mounted) return;
  await _runSave(context, () => onSave(value));
}

Future<void> _editSelectRow<T>({
  required BuildContext context,
  required String title,
  required List<(T, String)> options,
  required T? initial,
  required Future<void> Function(T value) onSave,
}) async {
  final value = await showSelectOptionSheet<T>(
    context: context,
    title: title,
    options: options,
    initial: initial,
  );
  if (value == null || !context.mounted) return;
  await _runSave(context, () => onSave(value));
}

Future<void> _runSave(BuildContext context, Future<void> Function() action) async {
  // barrierDismissible alone doesn't block the Android back gesture — without
  // PopScope, a back-press while `action` is in flight closes this dialog
  // early, and the pop below then removes the settings screen itself instead.
  var dialogIsOpen = true;
  showDialog<void>(
    context: context,
    barrierDismissible: false,
    builder: (_) => const PopScope(
      canPop: false,
      child: Center(child: CircularProgressIndicator()),
    ),
  ).then((_) => dialogIsOpen = false);

  ApiException? error;
  try {
    await action();
  } on ApiException catch (e) {
    error = e;
  }

  if (dialogIsOpen && context.mounted) {
    Navigator.of(context).pop();
  }
  if (error != null && context.mounted) {
    showSettingsErrorSnackBar(context, error.message);
  }
}

String _formatDate(DateTime date) =>
    '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';

String _displayNameFor(Map<String, dynamic> user) {
  final fullName = user['full_name'];
  if (fullName is String && fullName.isNotEmpty) return fullName;
  final email = user['email'];
  if (email is String && email.isNotEmpty) return email;
  return 'Utilisateur';
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          color: colors.textSecondary,
          fontSize: 12,
          fontWeight: FontWeight.w700,
          letterSpacing: .4,
        ),
      ),
    );
  }
}

class _SettingsGroup extends StatelessWidget {
  const _SettingsGroup({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
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
            if (i > 0) Divider(height: 1, indent: 16, color: colors.divider),
            children[i],
          ],
        ],
      ),
    );
  }
}

class _SettingsRow extends StatelessWidget {
  const _SettingsRow({required this.label, this.value, this.onTap});

  final String label;
  final String? value;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Text(label, style: TextStyle(color: colors.textPrimary, fontSize: 14)),
            const Spacer(),
            if (value != null)
              Flexible(
                child: Text(
                  value!,
                  textAlign: TextAlign.right,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: colors.textSecondary, fontSize: 14),
                ),
              ),
            if (onTap != null) ...[
              const SizedBox(width: 6),
              Icon(Icons.chevron_right, size: 20, color: colors.textSecondary),
            ],
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
