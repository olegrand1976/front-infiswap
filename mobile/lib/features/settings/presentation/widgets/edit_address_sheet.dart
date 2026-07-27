import 'package:flutter/material.dart';

import '../../../../core/api/api_exception.dart';
import '../../data/settings_repository.dart';
import '../../models/settings_models.dart';
import 'settings_sheet_scaffold.dart';

const _countryLabels = {'be': 'Belgique', 'fr': 'France'};
const _workingAtOptions = ['Belgique', 'France'];

Future<bool?> showEditAddressSheet({
  required BuildContext context,
  required SettingsRepository repository,
  required int userId,
  required AddressData initial,
}) {
  return showSettingsSheet<bool>(
    context: context,
    title: 'Adresse',
    bodyBuilder: (context) => _AddressForm(
      repository: repository,
      userId: userId,
      initial: initial,
    ),
  );
}

class _AddressForm extends StatefulWidget {
  const _AddressForm({
    required this.repository,
    required this.userId,
    required this.initial,
  });

  final SettingsRepository repository;
  final int userId;
  final AddressData initial;

  @override
  State<_AddressForm> createState() => _AddressFormState();
}

class _AddressFormState extends State<_AddressForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _streetController;
  late final TextEditingController _cityController;
  late final TextEditingController _zipController;
  late final TextEditingController _additionalInfoController;

  late String _country;
  String? _workingAt;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _streetController = TextEditingController(text: widget.initial.streetAddress);
    _cityController = TextEditingController(text: widget.initial.city);
    _zipController = TextEditingController(text: widget.initial.zipCode);
    _additionalInfoController = TextEditingController(text: widget.initial.additionalInfo ?? '');
    _country = _countryLabels.containsKey(widget.initial.country) ? widget.initial.country : 'be';
    _workingAt = widget.initial.workingAt;
  }

  @override
  void dispose() {
    _streetController.dispose();
    _cityController.dispose();
    _zipController.dispose();
    _additionalInfoController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final data = AddressData(
      streetAddress: _streetController.text.trim(),
      city: _cityController.text.trim(),
      country: _country,
      zipCode: _zipController.text.trim(),
      additionalInfo:
          _additionalInfoController.text.trim().isEmpty ? null : _additionalInfoController.text.trim(),
      workingAt: _workingAt,
    );

    try {
      await widget.repository.updateAddress(userId: widget.userId, data: data);
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
            controller: _streetController,
            decoration: const InputDecoration(labelText: 'Rue'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Champ requis' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _cityController,
            decoration: const InputDecoration(labelText: 'Ville'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Champ requis' : null,
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            initialValue: _country,
            decoration: const InputDecoration(labelText: 'Pays'),
            items: [
              for (final entry in _countryLabels.entries)
                DropdownMenuItem(value: entry.key, child: Text(entry.value)),
            ],
            onChanged: (value) => setState(() => _country = value ?? _country),
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            initialValue: _workingAt,
            decoration: const InputDecoration(labelText: 'Pays de travail'),
            items: [
              for (final option in _workingAtOptions)
                DropdownMenuItem(value: option, child: Text(option)),
            ],
            onChanged: (value) => setState(() => _workingAt = value),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _zipController,
            decoration: const InputDecoration(labelText: 'Code postal'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Champ requis' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _additionalInfoController,
            decoration: const InputDecoration(labelText: 'Complément'),
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
