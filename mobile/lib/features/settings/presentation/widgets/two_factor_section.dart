import 'package:flutter/material.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/settings_repository.dart';
import 'confirm_password_sheet.dart';
import 'settings_sheet_scaffold.dart';
import 'two_factor_code_sheet.dart';

class TwoFactorSection extends StatefulWidget {
  const TwoFactorSection({
    super.key,
    required this.repository,
    required this.initialEnabled,
    required this.email,
  });

  final SettingsRepository repository;
  final bool initialEnabled;
  final String email;

  @override
  State<TwoFactorSection> createState() => _TwoFactorSectionState();
}

class _TwoFactorSectionState extends State<TwoFactorSection> {
  late bool _enabled;
  bool _isBusy = false;

  @override
  void initState() {
    super.initState();
    _enabled = widget.initialEnabled;
  }

  Future<void> _handleToggle(bool wantsEnabled) async {
    if (wantsEnabled) {
      await _enable();
    } else {
      await _disable();
    }
  }

  Future<void> _enable() async {
    setState(() => _isBusy = true);
    try {
      await widget.repository.enableTwoFactor();
      if (!mounted) return;

      final verified = await showTwoFactorCodeSheet(
        context: context,
        repository: widget.repository,
        email: widget.email,
      );

      if (verified == true && mounted) {
        setState(() => _enabled = true);
        showSettingsSuccessSnackBar(context, 'Authentification à deux facteurs activée');
      }
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isBusy = false);
    }
  }

  Future<void> _disable() async {
    final password = await showConfirmPasswordSheet(
      context: context,
      title: 'Authentification à deux facteurs',
      description: 'Veuillez confirmer votre action en entrant votre mot de passe.',
      submitLabel: 'Valider',
    );
    if (password == null || !mounted) return;

    setState(() => _isBusy = true);
    try {
      await widget.repository.disableTwoFactor(currentPassword: password);
      if (mounted) {
        setState(() => _enabled = false);
        showSettingsSuccessSnackBar(context, 'Authentification à deux facteurs désactivée');
      }
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isBusy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return SwitchListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(
        'Authentification à deux facteurs',
        style: TextStyle(color: colors.textPrimary, fontSize: 14),
      ),
      value: _enabled,
      activeThumbColor: colors.onPrimary,
      activeTrackColor: colors.primary,
      onChanged: _isBusy ? null : _handleToggle,
    );
  }
}
