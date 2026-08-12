import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/location/location_repository.dart';
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
import '../../../core/theme/app_radii.dart';

const _validRoleKeys = ['nurse', 'caregiver', 'midwife'];

class CreateClassicScreen extends ConsumerStatefulWidget {
  const CreateClassicScreen({super.key});

  @override
  ConsumerState<CreateClassicScreen> createState() =>
      _CreateClassicScreenState();
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
      initialDateRange:
          DateTimeRange(start: now, end: now.add(const Duration(days: 1))),
    );
    if (range == null) return;
    setState(() {
      _periods.add(
          ReplacementPeriodInput(startDate: range.start, endDate: range.end));
    });
  }

  Future<void> _addZip() async {
    final value = _zipController.text.trim();
    if (value.isEmpty) return;
    if (!_zipCodes.contains(value)) {
      setState(() => _zipCodes = [..._zipCodes, value]);
    }
    _zipController.clear();

    try {
      final matches =
          await ref.read(locationRepositoryProvider).getCitiesFromZipCode(value);
      if (matches.isNotEmpty && mounted) {
        setState(() => _cities = {..._cities, ...matches}.toList());
      }
    } catch (_) {}
  }

  Future<void> _addCity() async {
    final value = _cityController.text.trim();
    if (value.isEmpty) return;
    if (!_cities.contains(value)) {
      setState(() => _cities = [..._cities, value]);
    }
    _cityController.clear();

    try {
      final matches =
          await ref.read(locationRepositoryProvider).getZipCodesFromCity(value);
      if (matches.isNotEmpty && mounted) {
        setState(() => _zipCodes = {..._zipCodes, ...matches}.toList());
      }
    } catch (_) {}
  }

  void _showSnack(String message, {bool isError = true}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppColors.coral : null,
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
      await ref
          .read(replacementCreateRepositoryProvider)
          .createClassic(payload);
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
                  _step == 0
                      ? 'ÉTAPE 1 SUR 2 — PÉRIODES'
                      : 'ÉTAPE 2 SUR 2 — DÉTAILS',
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
              child: _step == 0
                  ? _buildPeriodsStep(colors)
                  : _buildDetailsStep(colors),
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
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: colors.card,
                      border: Border.all(color: colors.border),
                      borderRadius: BorderRadius.circular(AppRadii.md),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.calendar_today_outlined,
                            size: 16, color: colors.primary),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            '${formatDateDmy(period.startDate)} → ${formatDateDmy(period.endDate)}',
                            style: TextStyle(
                                color: colors.textPrimary, fontSize: 13.5),
                          ),
                        ),
                        InkWell(
                          onTap: () => setState(() => _periods.remove(period)),
                          child: Icon(Icons.close,
                              size: 18, color: colors.textSecondary),
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
              const CreateFieldLabel('Créneau — Matin'),
              const SizedBox(height: 7),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: CreateTimeField(
                      label: 'Début',
                      value: _morningStart,
                      onTap: () => pickTimeOfDay24h(
                        context,
                        initial: _morningStart,
                        onPicked: (t) => setState(() => _morningStart = t),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: CreateTimeField(
                      label: 'Fin',
                      value: _morningEnd,
                      onTap: () => pickTimeOfDay24h(
                        context,
                        initial: _morningEnd,
                        onPicked: (t) => setState(() => _morningEnd = t),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const CreateFieldLabel('Créneau — Soir'),
              const SizedBox(height: 7),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: CreateTimeField(
                      label: 'Début',
                      value: _eveningStart,
                      onTap: () => pickTimeOfDay24h(
                        context,
                        initial: _eveningStart,
                        onPicked: (t) => setState(() => _eveningStart = t),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: CreateTimeField(
                      label: 'Fin',
                      value: _eveningEnd,
                      onTap: () => pickTimeOfDay24h(
                        context,
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
                label: 'Villes (optionnel)',
                hint: 'Ex. Bruxelles',
                icon: Icons.location_city_outlined,
                tags: _cities,
                onAdd: _addCity,
                onRemove: (tag) => setState(
                    () => _cities = _cities.where((c) => c != tag).toList()),
              ),
              const SizedBox(height: 16),
              const CreateFieldLabel('Type de soins'),
              const SizedBox(height: 7),
              careTypesAsync.when(
                loading: () => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Center(
                      child: CircularProgressIndicator(color: colors.primary)),
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
              const SizedBox(height: 16),
              TextField(
                controller: _commentController,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  hintText:
                      'Décrivez en quelques mots votre demande de remplacement…',
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
