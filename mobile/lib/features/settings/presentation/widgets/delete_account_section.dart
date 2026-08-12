import 'package:flutter/material.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/settings_repository.dart';
import 'confirm_password_sheet.dart';
import 'settings_sheet_scaffold.dart';

class DeleteAccountSection extends StatefulWidget {
  const DeleteAccountSection({
    super.key,
    required this.repository,
    required this.userId,
    required this.onDeleted,
  });

  final SettingsRepository repository;
  final int userId;
  final Future<void> Function() onDeleted;

  @override
  State<DeleteAccountSection> createState() => _DeleteAccountSectionState();
}

class _DeleteAccountSectionState extends State<DeleteAccountSection> {
  bool _isDeleting = false;

  Future<void> _handleDelete() async {
    final password = await showConfirmPasswordSheet(
      context: context,
      title: 'Se désinscrire',
      description:
          'Confirmez avec votre mot de passe. Votre compte sera supprimé et les '
          'administrateurs du site seront informés par e-mail.',
      submitLabel: 'Valider',
    );
    if (password == null || !mounted) return;

    setState(() => _isDeleting = true);
    try {
      await widget.repository
          .deleteAccount(userId: widget.userId, password: password);
      await widget.onDeleted();
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isDeleting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: _isDeleting ? null : _handleDelete,
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.coral,
          side: const BorderSide(color: AppColors.coral),
        ),
        icon: _isDeleting
            ? const SizedBox(
                height: 18,
                width: 18,
                child: CircularProgressIndicator(
                    strokeWidth: 2, color: AppColors.coral),
              )
            : const Icon(Icons.delete_outline),
        label: const Text('Se désinscrire'),
      ),
    );
  }
}
