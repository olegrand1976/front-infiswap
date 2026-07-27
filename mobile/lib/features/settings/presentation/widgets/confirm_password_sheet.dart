import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import 'settings_sheet_scaffold.dart';

/// Generic password re-entry prompt, used to confirm a sensitive action
/// (disabling 2FA, deleting the account) — mirrors the web's re-auth dialogs.
Future<String?> showConfirmPasswordSheet({
  required BuildContext context,
  required String title,
  required String description,
  required String submitLabel,
}) {
  return showSettingsSheet<String>(
    context: context,
    title: title,
    bodyBuilder: (context) => _ConfirmPasswordForm(
      description: description,
      submitLabel: submitLabel,
    ),
  );
}

class _ConfirmPasswordForm extends StatefulWidget {
  const _ConfirmPasswordForm({required this.description, required this.submitLabel});

  final String description;
  final String submitLabel;

  @override
  State<_ConfirmPasswordForm> createState() => _ConfirmPasswordFormState();
}

class _ConfirmPasswordFormState extends State<_ConfirmPasswordForm> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.of(context).pop(_passwordController.text);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(widget.description, style: TextStyle(color: colors.textSecondary)),
          const SizedBox(height: 16),
          TextFormField(
            controller: _passwordController,
            obscureText: true,
            autofocus: true,
            decoration: const InputDecoration(labelText: 'Mot de passe'),
            validator: (v) => (v == null || v.isEmpty) ? 'Champ requis' : null,
            onFieldSubmitted: (_) => _submit(),
          ),
          const SizedBox(height: 24),
          SettingsSheetSubmitButton(
            label: widget.submitLabel,
            isLoading: false,
            onPressed: _submit,
          ),
        ],
      ),
    );
  }
}
