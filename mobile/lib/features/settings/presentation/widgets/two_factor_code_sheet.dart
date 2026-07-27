import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/settings_repository.dart';
import 'settings_sheet_scaffold.dart';

Future<bool?> showTwoFactorCodeSheet({
  required BuildContext context,
  required SettingsRepository repository,
  required String email,
}) {
  return showSettingsSheet<bool>(
    context: context,
    title: 'Authentification à deux facteurs',
    bodyBuilder: (context) => _TwoFactorCodeForm(repository: repository, email: email),
  );
}

class _TwoFactorCodeForm extends StatefulWidget {
  const _TwoFactorCodeForm({required this.repository, required this.email});

  final SettingsRepository repository;
  final String email;

  @override
  State<_TwoFactorCodeForm> createState() => _TwoFactorCodeFormState();
}

class _TwoFactorCodeFormState extends State<_TwoFactorCodeForm> {
  final _formKey = GlobalKey<FormState>();
  final _codeController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      await widget.repository.verifyTwoFactorCode(code: _codeController.text);
      if (mounted) Navigator.of(context).pop(true);
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            "Afin d'activer cette option, entrez les 6 chiffres envoyés à ${widget.email}. "
            'Le code est valide 5 minutes.',
            style: TextStyle(color: colors.textSecondary),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _codeController,
            keyboardType: TextInputType.number,
            textAlign: TextAlign.center,
            autofocus: true,
            style: TextStyle(
              color: colors.textPrimary,
              fontSize: 24,
              letterSpacing: 8,
              fontWeight: FontWeight.w600,
            ),
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(6),
            ],
            decoration: const InputDecoration(labelText: 'Code à 6 chiffres'),
            validator: (v) => (v == null || v.length != 6) ? 'Le code doit contenir 6 chiffres' : null,
            onFieldSubmitted: (_) => _submit(),
          ),
          const SizedBox(height: 24),
          SettingsSheetSubmitButton(
            label: 'Valider',
            isLoading: _isLoading,
            onPressed: _submit,
          ),
        ],
      ),
    );
  }
}
