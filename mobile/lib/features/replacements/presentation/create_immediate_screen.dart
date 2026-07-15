import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/date_time_format.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../data/care_types_repository.dart';
import '../data/replacement_create_repository.dart';
import '../data/replacement_form_validators.dart';
import '../models/create_replacement_payload.dart';
import '../models/replacement_search_params.dart' show replacementRoleLabels;
import 'widgets/platform_access_sheet.dart';

const _validRoleKeys = ['nurse', 'caregiver', 'midwife'];

// Create immediate replacement screen
class CreateImmediateScreen extends ConsumerStatefulWidget {
  const CreateImmediateScreen({super.key});

  @override
  ConsumerState<CreateImmediateScreen> createState() =>
      _CreateImmediateScreenState();
}

class _CreateImmediateScreenState extends ConsumerState<CreateImmediateScreen> {
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;
  final _patientCountController = TextEditingController();
  final _zipController = TextEditingController();
  final _cityController = TextEditingController();
  List<String> _zipCodes = [];
  List<String> _cities = [];
  final Set<int> _careTypeIds = {};
  String? _roleType;
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    final roles = ref.read(authSessionProvider)?.roles ?? const [];
    final matching = roles.where(_validRoleKeys.contains).toList();
    if (matching.length == 1) {
      _roleType = matching.first;
    }
  }

  @override
  void dispose() {
    _patientCountController.dispose();
    _zipController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  bool get _showRoleSelector {
    final roles = ref.read(authSessionProvider)?.roles ?? const [];
    return roles.where(_validRoleKeys.contains).length != 1;
  }

  Future<void> _pickTime({required bool isStart}) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: (isStart ? _startTime : _endTime) ?? TimeOfDay.now(),
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: true),
        child: child!,
      ),
    );
    if (picked == null) return;
    setState(() {
      if (isStart) {
        _startTime = picked;
      } else {
        _endTime = picked;
      }
    });
  }

  void _addZip() {
    final value = _zipController.text.trim();
    if (value.isEmpty) return;
    if (!_zipCodes.contains(value)) {
      setState(() => _zipCodes = [..._zipCodes, value]);
    }
    _zipController.clear();
  }

  void _addCity() {
    final value = _cityController.text.trim();
    if (value.isEmpty) return;
    if (!_cities.contains(value)) {
      setState(() => _cities = [..._cities, value]);
    }
    _cityController.clear();
  }

  void _showSnack(String message, {bool isError = true}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red.shade600 : null,
      ),
    );
  }

  Future<void> _submit() async {
    final startTime = _startTime != null ? formatTimeOfDay(_startTime!) : null;
    final endTime = _endTime != null ? formatTimeOfDay(_endTime!) : null;

    final validationError = validateImmediateReplacementForm(
      startTime: startTime,
      endTime: endTime,
      patientCount: _patientCountController.text.trim(),
      roleType: _roleType,
      zipCodes: _zipCodes,
      cities: _cities,
      careTypeIds: _careTypeIds.toList(),
    );

    if (validationError != null) {
      _showSnack(validationError);
      return;
    }

    setState(() => _submitting = true);

    final payload = ImmediateReplacementPayload(
      startTime: startTime!,
      endTime: endTime!,
      patientCount: int.parse(_patientCountController.text.trim()),
      roleType: _roleType!,
      zipCodes: _zipCodes,
      cities: _cities,
      careTypeIds: _careTypeIds.toList(),
    );

    try {
      await ref.read(replacementCreateRepositoryProvider).createImmediate(payload);
      if (!mounted) return;
      Navigator.of(context).pop();
      _showSnack('Création du remplacement rapide effectuée', isError: false);
    } on ApiException catch (error) {
      if (error.isPlatformAccessRequired) {
        await PlatformAccessSheet.show(context);
      } else if (error.errors != null && error.errors!.isNotEmpty) {
        _showSnack(error.errors!.values.first.first);
      } else {
        _showSnack(error.message);
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final careTypesAsync = ref.watch(careTypesProvider);

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 16, 0),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: Icon(Icons.arrow_back, color: colors.primary),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Remplacement rapide',
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          "Pour aujourd'hui",
                          style: TextStyle(color: colors.textSecondary, fontSize: 12.5),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: colors.primaryMuted,
                      border: Border.all(color: colors.border),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Besoin d'aide rapidement ?",
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontWeight: FontWeight.w700,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Rien de plus simple — un créneau, quelques infos, publié en 1 minute.',
                          style: TextStyle(color: colors.textSecondary, fontSize: 12.5),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: _TimeField(
                          label: 'Heure début',
                          value: _startTime,
                          onTap: () => _pickTime(isStart: true),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _TimeField(
                          label: 'Heure fin',
                          value: _endTime,
                          onTap: () => _pickTime(isStart: false),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const _FieldLabel('Nombre de patients'),
                  const SizedBox(height: 7),
                  TextField(
                    controller: _patientCountController,
                    keyboardType: TextInputType.number,
                    decoration: _pillDecoration(colors, hint: 'Ex. 3'),
                  ),
                  const SizedBox(height: 16),
                  const _FieldLabel('Codes postaux'),
                  const SizedBox(height: 7),
                  _TagField(
                    controller: _zipController,
                    hint: 'Ex. 1000',
                    keyboardType: TextInputType.number,
                    tags: _zipCodes,
                    onAdd: _addZip,
                    onRemove: (tag) =>
                        setState(() => _zipCodes = _zipCodes.where((z) => z != tag).toList()),
                  ),
                  const SizedBox(height: 16),
                  const _FieldLabel('Villes'),
                  const SizedBox(height: 7),
                  _TagField(
                    controller: _cityController,
                    hint: 'Ex. Bruxelles',
                    tags: _cities,
                    onAdd: _addCity,
                    onRemove: (tag) =>
                        setState(() => _cities = _cities.where((c) => c != tag).toList()),
                  ),
                  const SizedBox(height: 16),
                  const _FieldLabel('Type de soins'),
                  const SizedBox(height: 7),
                  careTypesAsync.when(
                    loading: () => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      child: Center(
                        child: CircularProgressIndicator(color: colors.primary),
                      ),
                    ),
                    error: (error, _) => Text(
                      'Types de soins indisponibles.',
                      style: TextStyle(color: colors.textSecondary, fontSize: 12.5),
                    ),
                    data: (careTypes) => Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final careType in careTypes)
                          _TogglePill(
                            label: careType.name,
                            selected: _careTypeIds.contains(careType.id),
                            onTap: () => setState(() {
                              if (_careTypeIds.contains(careType.id)) {
                                _careTypeIds.remove(careType.id);
                              } else {
                                _careTypeIds.add(careType.id);
                              }
                            }),
                          ),
                      ],
                    ),
                  ),
                  if (_showRoleSelector) ...[
                    const SizedBox(height: 16),
                    const _FieldLabel('Demander en tant que'),
                    const SizedBox(height: 7),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final key in _validRoleKeys)
                          _TogglePill(
                            label: replacementRoleLabels[key]!,
                            selected: _roleType == key,
                            onTap: () => setState(() => _roleType = key),
                          ),
                      ],
                    ),
                  ],
                  const SizedBox(height: 28),
                  ElevatedButton(
                    onPressed: _submitting ? null : _submit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors.primary,
                      foregroundColor: colors.onPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    child: _submitting
                        ? SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: colors.onPrimary,
                            ),
                          )
                        : const Text('Publier'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

InputDecoration _pillDecoration(AppPalette colors, {String? hint}) {
  return InputDecoration(
    hintText: hint,
    filled: true,
    fillColor: colors.inputBackground,
    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(999),
      borderSide: BorderSide(color: colors.inputBorder),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(999),
      borderSide: BorderSide(color: colors.inputBorder),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(999),
      borderSide: BorderSide(color: colors.primary),
    ),
  );
}

class _FieldLabel extends StatelessWidget {
  const _FieldLabel(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    return Text(
      label.toUpperCase(),
      style: TextStyle(
        color: colors.textSecondary,
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: .4,
      ),
    );
  }
}

class _TimeField extends StatelessWidget {
  const _TimeField({required this.label, required this.value, required this.onTap});

  final String label;
  final TimeOfDay? value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _FieldLabel(label),
        const SizedBox(height: 7),
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(999),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
            decoration: BoxDecoration(
              color: colors.inputBackground,
              border: Border.all(color: colors.inputBorder),
              borderRadius: BorderRadius.circular(999),
            ),
            child: Row(
              children: [
                Icon(Icons.schedule, size: 16, color: colors.primary),
                const SizedBox(width: 8),
                Text(
                  value != null ? formatTimeOfDay(value!) : '--:--',
                  style: TextStyle(
                    color: value != null ? colors.textPrimary : colors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _TagField extends StatelessWidget {
  const _TagField({
    required this.controller,
    required this.hint,
    required this.tags,
    required this.onAdd,
    required this.onRemove,
    this.keyboardType,
  });

  final TextEditingController controller;
  final String hint;
  final List<String> tags;
  final VoidCallback onAdd;
  final void Function(String tag) onRemove;
  final TextInputType? keyboardType;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                keyboardType: keyboardType,
                textInputAction: TextInputAction.done,
                onSubmitted: (_) => onAdd(),
                decoration: _pillDecoration(colors, hint: hint),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: onAdd,
              style: IconButton.styleFrom(
                backgroundColor: colors.primary,
                foregroundColor: colors.onPrimary,
              ),
              icon: const Icon(Icons.add),
            ),
          ],
        ),
        if (tags.isNotEmpty) ...[
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final tag in tags)
                InputChip(
                  label: Text(tag),
                  deleteIconColor: colors.textSecondary,
                  onDeleted: () => onRemove(tag),
                  backgroundColor: colors.primaryMuted,
                  side: BorderSide(color: colors.primaryOutline),
                  labelStyle: TextStyle(color: colors.primary),
                ),
            ],
          ),
        ],
      ],
    );
  }
}

class _TogglePill extends StatelessWidget {
  const _TogglePill({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? colors.primary : colors.card,
          border: Border.all(color: selected ? colors.primary : colors.border),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? colors.onPrimary : colors.textPrimary,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
