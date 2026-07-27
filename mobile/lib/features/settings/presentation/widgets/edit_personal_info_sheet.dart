import 'package:flutter/material.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/settings_repository.dart';
import '../../models/settings_models.dart';
import 'settings_sheet_scaffold.dart';

const _genderLabels = {'M': 'Homme', 'F': 'Femme', 'X': 'X'};
const _professionalCategoryLabels = {
  'salaried': 'Salarié(e)',
  'independent': 'Indépendant(e)',
};

Future<bool?> showEditPersonalInfoSheet({
  required BuildContext context,
  required SettingsRepository repository,
  required int userId,
  required PersonalInfoData initial,
  required bool isInstitution,
}) {
  return showSettingsSheet<bool>(
    context: context,
    title: 'Informations personnelles',
    bodyBuilder: (context) => _PersonalInfoForm(
      repository: repository,
      userId: userId,
      initial: initial,
      isInstitution: isInstitution,
    ),
  );
}

class _PersonalInfoForm extends StatefulWidget {
  const _PersonalInfoForm({
    required this.repository,
    required this.userId,
    required this.initial,
    required this.isInstitution,
  });

  final SettingsRepository repository;
  final int userId;
  final PersonalInfoData initial;
  final bool isInstitution;

  @override
  State<_PersonalInfoForm> createState() => _PersonalInfoFormState();
}

class _PersonalInfoFormState extends State<_PersonalInfoForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _lastnameController;
  late final TextEditingController _firstnameController;
  late final TextEditingController _emailController;
  late final TextEditingController _identifierController;
  late final TextEditingController _phoneController;

  DateTime? _dateOfBirth;
  String? _gender;
  String? _professionalCategory;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _lastnameController = TextEditingController(text: widget.initial.lastname);
    _firstnameController = TextEditingController(text: widget.initial.firstname);
    _emailController = TextEditingController(text: widget.initial.email);
    _identifierController = TextEditingController(text: widget.initial.identifierNumber ?? '');
    _phoneController = TextEditingController(text: widget.initial.phoneNumber ?? '');
    _dateOfBirth = widget.initial.dateOfBirth;
    _gender = widget.initial.gender;
    _professionalCategory = widget.initial.professionalCategory;
  }

  @override
  void dispose() {
    _lastnameController.dispose();
    _firstnameController.dispose();
    _emailController.dispose();
    _identifierController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _pickDateOfBirth() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _dateOfBirth ?? DateTime(now.year - 30),
      firstDate: DateTime(1900),
      lastDate: now,
    );
    if (picked != null) {
      setState(() => _dateOfBirth = picked);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final data = PersonalInfoData(
      institutionName: widget.initial.institutionName,
      lastname: _lastnameController.text.trim(),
      firstname: _firstnameController.text.trim(),
      dateOfBirth: _dateOfBirth,
      email: _emailController.text.trim(),
      identifierNumber: _identifierController.text.trim().isEmpty
          ? null
          : _identifierController.text.trim(),
      phoneNumber: _phoneController.text.trim().isEmpty ? null : _phoneController.text.trim(),
      gender: _gender,
      professionalCategory: _professionalCategory,
    );

    try {
      await widget.repository.updateInformation(
        userId: widget.userId,
        data: data,
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
    final colors = context.appColors;

    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (widget.isInstitution && widget.initial.institutionName != null) ...[
            InputDecorator(
              decoration: const InputDecoration(labelText: "Nom de l'institution"),
              child: Text(widget.initial.institutionName!),
            ),
            const SizedBox(height: 16),
          ],
          TextFormField(
            controller: _lastnameController,
            decoration: const InputDecoration(labelText: 'Nom'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Champ requis' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _firstnameController,
            decoration: const InputDecoration(labelText: 'Prénom'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Champ requis' : null,
          ),
          const SizedBox(height: 16),
          InkWell(
            onTap: _pickDateOfBirth,
            child: InputDecorator(
              decoration: const InputDecoration(
                labelText: 'Date de naissance',
                suffixIcon: Icon(Icons.calendar_today_outlined),
              ),
              child: Text(
                _dateOfBirth != null
                    ? '${_dateOfBirth!.day.toString().padLeft(2, '0')}/${_dateOfBirth!.month.toString().padLeft(2, '0')}/${_dateOfBirth!.year}'
                    : 'jj/mm/aaaa',
                style: TextStyle(
                  color: _dateOfBirth != null ? colors.textPrimary : colors.textSecondary,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(labelText: 'Email'),
            validator: (v) {
              if (v == null || v.trim().isEmpty) return 'Champ requis';
              if (!v.contains('@')) return 'Email invalide';
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _identifierController,
            decoration: const InputDecoration(labelText: "Numéro d'identification"),
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(labelText: 'Téléphone'),
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            initialValue: _gender,
            decoration: const InputDecoration(labelText: 'Sexe'),
            items: [
              for (final entry in _genderLabels.entries)
                DropdownMenuItem(value: entry.key, child: Text(entry.value)),
            ],
            onChanged: (value) => setState(() => _gender = value),
          ),
          if (!widget.isInstitution) ...[
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              initialValue: _professionalCategory,
              decoration: const InputDecoration(labelText: 'Catégorie professionnelle'),
              items: [
                for (final entry in _professionalCategoryLabels.entries)
                  DropdownMenuItem(value: entry.key, child: Text(entry.value)),
              ],
              onChanged: (value) => setState(() => _professionalCategory = value),
            ),
          ],
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
