import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/date_time_format.dart';
import '../data/care_types_repository.dart';
import '../data/my_replacements_list_notifier.dart';
import '../data/replacement_create_repository.dart';
import '../models/create_replacement_payload.dart';
import '../models/replacement_edit_data.dart';
import '../models/replacement_item.dart';
import 'widgets/create_form_fields.dart';

class EditReplacementScreen extends ConsumerStatefulWidget {
  const EditReplacementScreen({
    super.key,
    required this.item,
    this.isRepost = false,
  });

  final ReplacementItem item;

  final bool isRepost;

  @override
  ConsumerState<EditReplacementScreen> createState() =>
      _EditReplacementScreenState();
}

class _EditReplacementScreenState extends ConsumerState<EditReplacementScreen> {
  bool _loading = true;
  bool _submitting = false;
  String? _loadError;
  ReplacementEditData? _data;

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

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _patientCountController.dispose();
    _zipController.dispose();
    _cityController.dispose();
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _loadError = null;
    });

    try {
      final id = int.parse(widget.item.id);
      final data =
          await ref.read(replacementCreateRepositoryProvider).fetchForEdit(id);
      if (!mounted) return;
      setState(() {
        _data = data;
        _periods
          ..clear()
          ..addAll(data.periods);
        _patientCountController.text = data.patientCount;
        _zipCodes = data.zipCodes;
        _cities = data.cities;
        _careTypeIds
          ..clear()
          ..addAll(data.careTypeIds);
        _commentController.text = data.comment;
        _morningStart = _parseTimeOfDay(data.morning.startAt);
        _morningEnd = _parseTimeOfDay(data.morning.endAt);
        _eveningStart = _parseTimeOfDay(data.evening.startAt);
        _eveningEnd = _parseTimeOfDay(data.evening.endAt);
        _loading = false;
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() {
        _loadError = error.message;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loadError = 'Impossible de charger cette annonce.';
        _loading = false;
      });
    }
  }

  TimeOfDay? _parseTimeOfDay(String? raw) {
    if (raw == null || raw.isEmpty) return null;
    final parts = raw.split(':');
    if (parts.length < 2) return null;
    final hour = int.tryParse(parts[0]);
    final minute = int.tryParse(parts[1]);
    if (hour == null || minute == null) return null;
    return TimeOfDay(hour: hour, minute: minute);
  }

  TimeSlotRange get _morning => TimeSlotRange(
        startAt: _morningStart != null ? formatTimeOfDay(_morningStart!) : null,
        endAt: _morningEnd != null ? formatTimeOfDay(_morningEnd!) : null,
      );

  TimeSlotRange get _evening => TimeSlotRange(
        startAt: _eveningStart != null ? formatTimeOfDay(_eveningStart!) : null,
        endAt: _eveningEnd != null ? formatTimeOfDay(_eveningEnd!) : null,
      );

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

  String? _validate() {
    if (_periods.isEmpty) {
      return 'Veuillez sélectionner au moins une période de remplacement.';
    }
    for (final period in _periods) {
      if (period.endDate.isBefore(period.startDate)) {
        return 'La date de fin doit être postérieure ou égale à la date de début.';
      }
    }
    final patientCount = _patientCountController.text.trim();
    if (!RegExp(r'^\d+$').hasMatch(patientCount)) {
      return 'Veuillez indiquer un nombre de patients valide.';
    }
    if (_zipCodes.isEmpty) {
      return 'Veuillez ajouter au moins un code postal.';
    }
    if (_careTypeIds.isEmpty) {
      return 'Veuillez sélectionner au moins un type de soin.';
    }
    if (!_morning.isFilled && !_evening.isFilled) {
      return 'Veuillez renseigner au moins un créneau horaire (matin ou soir).';
    }
    return null;
  }

  Future<void> _submit() async {
    final data = _data;
    if (data == null) return;

    final validationError = _validate();
    if (validationError != null) {
      _showSnack(validationError);
      return;
    }

    setState(() => _submitting = true);

    final payload = UpdateReplacementPayload(
      userId: data.userId,
      visibility: data.visibility,
      status: widget.isRepost ? 'open' : data.status,
      type: data.type,
      experienceYears: data.experienceYears,
      periods: _periods,
      patientCount: int.parse(_patientCountController.text.trim()),
      zipCodes: _zipCodes,
      cities: _cities,
      careTypeIds: _careTypeIds.toList(),
      country: data.country,
      morning: _morning,
      evening: _evening,
      comment: _commentController.text,
    );

    try {
      await ref
          .read(replacementCreateRepositoryProvider)
          .updateAgain(data.id, payload);
      if (!mounted) return;
      ref.read(myReplacementsListProvider.notifier).refresh();
      Navigator.of(context).pop(true);
      _showSnack(
        widget.isRepost ? 'Annonce republiée' : 'Annonce mise à jour',
        isError: false,
      );
    } on ApiException catch (error) {
      var message = error.message;
      if (error.errors != null && error.errors!.isNotEmpty) {
        message = error.errors!.values.first.first;
      }
      _showSnack(message);
    } catch (_) {
      _showSnack('Une erreur est survenue.');
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
                    onPressed: () => Navigator.of(context).pop(),
                    icon: Icon(Icons.arrow_back, color: colors.primary),
                  ),
                  Expanded(
                    child: Text(
                      widget.isRepost
                          ? "Republier l'annonce"
                          : "Modifier l'annonce",
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
            Expanded(child: _buildBody(colors)),
          ],
        ),
      ),
    );
  }

  Widget _buildBody(AppPalette colors) {
    if (_loading) {
      return Center(child: CircularProgressIndicator(color: colors.primary));
    }

    if (_loadError != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                _loadError!,
                textAlign: TextAlign.center,
                style: TextStyle(color: colors.textSecondary),
              ),
              const SizedBox(height: 16),
              ElevatedButton(onPressed: _load, child: const Text('Réessayer')),
            ],
          ),
        ),
      );
    }

    final careTypesAsync = ref.watch(careTypesProvider);

    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
            children: [
              const CreateFieldLabel('Périodes'),
              const SizedBox(height: 7),
              for (final period in _periods)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: colors.card,
                      border: Border.all(color: colors.border),
                      borderRadius: BorderRadius.circular(12),
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
              const SizedBox(height: 16),
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
          child: SizedBox(
            width: double.infinity,
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
                  : Text(widget.isRepost ? 'Republier' : 'Enregistrer'),
            ),
          ),
        ),
      ],
    );
  }
}
