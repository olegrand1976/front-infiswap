import 'package:flutter/material.dart';

import 'settings_sheet_scaffold.dart';

/// Generic single-field editor — the caller owns the actual save (API call),
/// this only collects and validates the new value.
Future<String?> showEditTextFieldSheet({
  required BuildContext context,
  required String title,
  required String initialValue,
  TextInputType? keyboardType,
  bool required = true,
  String? Function(String?)? validator,
}) {
  return showSettingsSheet<String>(
    context: context,
    title: title,
    bodyBuilder: (context) => _EditTextFieldForm(
      initialValue: initialValue,
      keyboardType: keyboardType,
      validator: validator ??
          (required
              ? (v) => (v == null || v.trim().isEmpty) ? 'Champ requis' : null
              : null),
    ),
  );
}

class _EditTextFieldForm extends StatefulWidget {
  const _EditTextFieldForm({
    required this.initialValue,
    required this.keyboardType,
    required this.validator,
  });

  final String initialValue;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;

  @override
  State<_EditTextFieldForm> createState() => _EditTextFieldFormState();
}

class _EditTextFieldFormState extends State<_EditTextFieldForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.of(context).pop(_controller.text.trim());
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextFormField(
            controller: _controller,
            keyboardType: widget.keyboardType,
            autofocus: true,
            textInputAction: TextInputAction.done,
            validator: widget.validator,
            onFieldSubmitted: (_) => _submit(),
          ),
          const SizedBox(height: 24),
          SettingsSheetSubmitButton(
            label: 'Enregistrer',
            isLoading: false,
            onPressed: _submit,
          ),
        ],
      ),
    );
  }
}
