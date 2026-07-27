import 'package:flutter/material.dart';

import '../../../../core/api/api_exception.dart';
import '../../data/settings_repository.dart';
import 'settings_sheet_scaffold.dart';

Future<bool?> showChangePasswordSheet({
  required BuildContext context,
  required SettingsRepository repository,
  required int userId,
}) {
  return showSettingsSheet<bool>(
    context: context,
    title: 'Changer le mot de passe',
    bodyBuilder: (context) => _ChangePasswordForm(repository: repository, userId: userId),
  );
}

class _ChangePasswordForm extends StatefulWidget {
  const _ChangePasswordForm({required this.repository, required this.userId});

  final SettingsRepository repository;
  final int userId;

  @override
  State<_ChangePasswordForm> createState() => _ChangePasswordFormState();
}

class _ChangePasswordFormState extends State<_ChangePasswordForm> {
  final _formKey = GlobalKey<FormState>();
  final _currentPasswordController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      await widget.repository.updatePassword(
        userId: widget.userId,
        currentPassword: _currentPasswordController.text,
        password: _passwordController.text,
        passwordConfirmation: _confirmController.text,
      );
      if (mounted) Navigator.of(context).pop(true);
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextFormField(
            controller: _currentPasswordController,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Mot de passe actuel'),
            validator: (v) => (v == null || v.isEmpty) ? 'Champ requis' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _passwordController,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Nouveau mot de passe'),
            validator: (v) => (v == null || v.length < 8) ? 'Minimum 8 caractères' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _confirmController,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Confirmer le mot de passe'),
            validator: (v) {
              if (v != _passwordController.text) return 'Les mots de passe ne correspondent pas';
              return null;
            },
          ),
          const SizedBox(height: 24),
          SettingsSheetSubmitButton(
            label: 'Enregistrer',
            isLoading: _isLoading,
            onPressed: _submit,
          ),
        ],
      ),
    );
  }
}
