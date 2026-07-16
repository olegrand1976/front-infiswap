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
import 'widgets/create_form_fields.dart';
import 'widgets/platform_access_sheet.dart';

const _validRoleKeys = ['nurse', 'caregiver', 'midwife'];

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
        backgroundColor: isError ? AppColors.coral : null,
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
      await ref
          .read(replacementCreateRepositoryProvider)
          .createImmediate(payload);
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
                          style: TextStyle(
                              color: colors.textSecondary, fontSize: 12.5),
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
                      borderRadius: BorderRadius.circular(12),
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
                          style: TextStyle(
                              color: colors.textSecondary, fontSize: 12.5),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: CreateTimeField(
                          label: 'Heure début',
                          value: _startTime,
                          onTap: () => pickTimeOfDay24h(
                            context,
                            initial: _startTime,
                            onPicked: (t) => setState(() => _startTime = t),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: CreateTimeField(
                          label: 'Heure fin',
                          value: _endTime,
                          onTap: () => pickTimeOfDay24h(
                            context,
                            initial: _endTime,
                            onPicked: (t) => setState(() => _endTime = t),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _patientCountController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Nombre de patients',
                      hintText: 'Ex. 3',
                      prefixIcon: Icon(Icons.groups_outlined),
                    ),
                  ),
                  const SizedBox(height: 16),
                  CreateTagField(
                    controller: _zipController,
                    label: 'Codes postaux',
                    hint: 'Ex. 1000',
                    icon: Icons.location_on_outlined,
                    keyboardType: TextInputType.number,
                    tags: _zipCodes,
                    onAdd: _addZip,
                    onRemove: (tag) => setState(() =>
                        _zipCodes = _zipCodes.where((z) => z != tag).toList()),
                  ),
                  const SizedBox(height: 16),
                  CreateTagField(
                    controller: _cityController,
                    label: 'Villes',
                    hint: 'Ex. Bruxelles',
                    icon: Icons.location_city_outlined,
                    tags: _cities,
                    onAdd: _addCity,
                    onRemove: (tag) => setState(() =>
                        _cities = _cities.where((c) => c != tag).toList()),
                  ),
                  const SizedBox(height: 16),
                  const CreateFieldLabel('Type de soins'),
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
                      style: TextStyle(
                          color: colors.textSecondary, fontSize: 12.5),
                    ),
                    data: (careTypes) => Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final careType in careTypes)
                          CreateTogglePill(
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
                    const CreateFieldLabel('Demander en tant que'),
                    const SizedBox(height: 7),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final key in _validRoleKeys)
                          CreateTogglePill(
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
                      padding: const EdgeInsets.symmetric(vertical: 15),
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
