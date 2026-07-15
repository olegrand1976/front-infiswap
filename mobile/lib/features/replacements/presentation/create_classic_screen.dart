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

class CreateClassicScreen extends ConsumerStatefulWidget {
  const CreateClassicScreen({super.key});

  @override
  ConsumerState<CreateClassicScreen> createState() => _CreateClassicScreenState();
}

class _CreateClassicScreenState extends ConsumerState<CreateClassicScreen> {
  int _step = 0;

  final List<ReplacementPeriodInput> _periods = [];

  TimeOfDay? _morningStart;
  TimeOfDay? _morningEnd;
  TimeOfDay? _eveningStart;
  TimeOfDay? _eveningEnd;
  final _patientCountController = TextEditingController();
  final _zipController = TextEditingController();
  final _cityController = TextEditingController();
  final _commentController = TextEditingController();
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
    _commentController.dispose();
    super.dispose();
  }

  bool get _showRoleSelector {
    final roles = ref.read(authSessionProvider)?.roles ?? const [];
    return roles.where(_validRoleKeys.contains).length != 1;
  }

  Future<void> _addPeriod() async {
    final now = DateTime.now();
    final range = await showDateRangePicker(
      context: context,
      firstDate: DateTime(now.year, now.month, now.day),
      lastDate: DateTime(now.year + 2),
      initialDateRange: DateTimeRange(start: now, end: now.add(const Duration(days: 1))),
    );
    if (range == null) return;
    setState(() {
      _periods.add(ReplacementPeriodInput(startDate: range.start, endDate: range.end));
    });
  }

  Future<void> _pickTime({
    required TimeOfDay? initial,
    required void Function(TimeOfDay) onPicked,
  }) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: initial ?? TimeOfDay.now(),
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: true),
        child: child!,
      ),
    );
    if (picked != null) onPicked(picked);
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

  TimeSlotRange get _morning => TimeSlotRange(
        startAt: _morningStart != null ? formatTimeOfDay(_morningStart!) : null,
        endAt: _morningEnd != null ? formatTimeOfDay(_morningEnd!) : null,
      );

  TimeSlotRange get _evening => TimeSlotRange(
        startAt: _eveningStart != null ? formatTimeOfDay(_eveningStart!) : null,
        endAt: _eveningEnd != null ? formatTimeOfDay(_eveningEnd!) : null,
      );

  void _goToDetails() {
    if (_periods.isEmpty) {
      _showSnack('Veuillez sélectionner au moins une période de remplacement.');
      return;
    }
    setState(() => _step = 1);
  }

  Future<void> _submit() async {
    final patientCount = _patientCountController.text.trim();

    final validationError = validateClassicReplacementForm(
      roleType: _roleType,
      periods: _periods,
      patientCount: patientCount,
      zipCodes: _zipCodes,
      careTypeIds: _careTypeIds.toList(),
      morning: _morning,
      evening: _evening,
    );

    if (validationError != null) {
      _showSnack(validationError);
      return;
    }

    setState(() => _submitting = true);

    final payload = ClassicReplacementPayload(
      periods: _periods,
      roleType: _roleType!,
      patientCount: patientCount,
      zipCodes: _zipCodes,
      cities: _cities,
      careTypeIds: _careTypeIds.toList(),
      morning: _morning,
      evening: _evening,
      comment: _commentController.text,
    );

    try {
      await ref.read(replacementCreateRepositoryProvider).createClassic(payload);
      if (!mounted) return;
      Navigator.of(context).pop();
      _showSnack('Création effectuée', isError: false);
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
                    onPressed: () {
                      if (_step == 1) {
                        setState(() => _step = 0);
                      } else {
                        Navigator.of(context).pop();
                      }
                    },
                    icon: Icon(Icons.arrow_back, color: colors.primary),
                  ),
                  Expanded(
                    child: Text(
                      'Créer un remplacement',
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 4),
              child: Row(
                children: [
                  const Expanded(child: _StepDot(active: true)),
                  const SizedBox(width: 6),
                  Expanded(child: _StepDot(active: _step == 1)),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  _step == 0 ? 'ÉTAPE 1 SUR 2 — PÉRIODES' : 'ÉTAPE 2 SUR 2 — DÉTAILS',
                  style: TextStyle(
                    color: colors.textSecondary,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: .4,
                  ),
                ),
              ),
            ),
            Expanded(
              child: _step == 0 ? _buildPeriodsStep(colors) : _buildDetailsStep(colors),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPeriodsStep(AppPalette colors) {
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
            children: [
              for (final period in _periods)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: colors.card,
                      border: Border.all(color: colors.border),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.calendar_today_outlined, size: 16, color: colors.primary),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            '${formatDateDmy(period.startDate)} → ${formatDateDmy(period.endDate)}',
                            style: TextStyle(color: colors.textPrimary, fontSize: 13.5),
                          ),
                        ),
                        InkWell(
                          onTap: () => setState(() => _periods.remove(period)),
                          child: Icon(Icons.close, size: 18, color: colors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ),
              OutlinedButton.icon(
                onPressed: _addPeriod,
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Ajouter période'),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
          child: ElevatedButton(
            onPressed: _goToDetails,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
            ),
            child: const Text('Suivant'),
          ),
        ),
      ],
    );
  }

  Widget _buildDetailsStep(AppPalette colors) {
    final careTypesAsync = ref.watch(careTypesProvider);

    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
            children: [
              const _FieldLabel('Créneau — Matin'),
              const SizedBox(height: 7),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: _TimeField(
                      label: 'Début',
                      value: _morningStart,
                      onTap: () => _pickTime(
                        initial: _morningStart,
                        onPicked: (t) => setState(() => _morningStart = t),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _TimeField(
                      label: 'Fin',
                      value: _morningEnd,
                      onTap: () => _pickTime(
                        initial: _morningEnd,
                        onPicked: (t) => setState(() => _morningEnd = t),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const _FieldLabel('Créneau — Soir'),
              const SizedBox(height: 7),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: _TimeField(
                      label: 'Début',
                      value: _eveningStart,
                      onTap: () => _pickTime(
                        initial: _eveningStart,
                        onPicked: (t) => setState(() => _eveningStart = t),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _TimeField(
                      label: 'Fin',
                      value: _eveningEnd,
                      onTap: () => _pickTime(
                        initial: _eveningEnd,
                        onPicked: (t) => setState(() => _eveningEnd = t),
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
                  labelText: 'Patients / jour',
                  hintText: 'Ex. 4',
                  prefixIcon: Icon(Icons.groups_outlined),
                ),
              ),
              const SizedBox(height: 16),
              _TagField(
                controller: _zipController,
                label: 'Codes postaux',
                hint: 'Ex. 1000',
                icon: Icons.location_on_outlined,
                keyboardType: TextInputType.number,
                tags: _zipCodes,
                onAdd: _addZip,
                onRemove: (tag) => setState(() => _zipCodes = _zipCodes.where((z) => z != tag).toList()),
              ),
              const SizedBox(height: 16),
              _TagField(
                controller: _cityController,
                label: 'Villes (optionnel)',
                hint: 'Ex. Bruxelles',
                icon: Icons.location_city_outlined,
                tags: _cities,
                onAdd: _addCity,
                onRemove: (tag) => setState(() => _cities = _cities.where((c) => c != tag).toList()),
              ),
              const SizedBox(height: 16),
              const _FieldLabel('Type de soins'),
              const SizedBox(height: 7),
              careTypesAsync.when(
                loading: () => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Center(child: CircularProgressIndicator(color: colors.primary)),
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
              const SizedBox(height: 16),
              TextField(
                controller: _commentController,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  hintText: 'Décrivez en quelques mots votre demande de remplacement…',
                  alignLabelWithHint: true,
                ),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => _step = 0),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 15),
                  ),
                  child: const Text('Retour'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 2,
                child: ElevatedButton(
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
                      : const Text('Enregistrer'),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _StepDot extends StatelessWidget {
  const _StepDot({required this.active});

  final bool active;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    return Container(
      height: 5,
      decoration: BoxDecoration(
        color: active ? colors.primary : colors.divider,
        borderRadius: BorderRadius.circular(3),
      ),
    );
  }
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

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: const Icon(Icons.schedule),
        ),
        child: Text(
          value != null ? formatTimeOfDay(value!) : '--:--',
          style: TextStyle(
            color: value != null ? colors.textPrimary : colors.textSecondary,
          ),
        ),
      ),
    );
  }
}

class _TagField extends StatelessWidget {
  const _TagField({
    required this.controller,
    required this.label,
    required this.hint,
    required this.icon,
    required this.tags,
    required this.onAdd,
    required this.onRemove,
    this.keyboardType,
  });

  final TextEditingController controller;
  final String label;
  final String hint;
  final IconData icon;
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
                decoration: InputDecoration(
                  labelText: label,
                  hintText: hint,
                  prefixIcon: Icon(icon),
                ),
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
