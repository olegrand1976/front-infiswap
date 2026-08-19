import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/date_time_format.dart';
import '../data/care_types_repository.dart';
import '../data/my_replacements_list_notifier.dart';
import '../data/replacement_create_repository.dart';
import '../data/replacement_form_validators.dart';
import '../models/create_replacement_payload.dart';
import '../models/replacement_edit_data.dart';
import '../models/replacement_item.dart';
import 'widgets/create_form_fields.dart';

/// Edit form for a `type: immediate` replacement — mirrors
/// [CreateImmediateScreen]'s fields (single time slot, no periods, no
/// comment) since its validation and payload shape differ from the
/// classic form handled by [EditReplacementScreen]. Role can't be changed
/// here: the update endpoint doesn't accept it, same as on web.
class EditImmediateReplacementScreen extends ConsumerStatefulWidget {
  const EditImmediateReplacementScreen({
    super.key,
    required this.item,
    this.isRepost = false,
  });

  final ReplacementItem item;
  final bool isRepost;

  @override
  ConsumerState<EditImmediateReplacementScreen> createState() =>
      _EditImmediateReplacementScreenState();
}

class _EditImmediateReplacementScreenState
    extends ConsumerState<EditImmediateReplacementScreen> {
  bool _loading = true;
  bool _submitting = false;
  String? _loadError;
  ReplacementEditData? _data;

  TimeOfDay? _startTime;
  TimeOfDay? _endTime;
  final _patientCountController = TextEditingController();
  final _zipController = TextEditingController();
  final _cityController = TextEditingController();
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
        _startTime = _parseTimeOfDay(data.detailStartAt);
        _endTime = _parseTimeOfDay(data.detailEndAt);
        _patientCountController.text = data.patientCount;
        _zipCodes = data.zipCodes;
        _cities = data.cities;
        _careTypeIds
          ..clear()
          ..addAll(data.careTypeIds);
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

  Future<void> _addZip() async {
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
    final data = _data;
    if (data == null) return;

    final startTime = _startTime != null ? formatTimeOfDay(_startTime!) : null;
    final endTime = _endTime != null ? formatTimeOfDay(_endTime!) : null;

    final validationError = validateImmediateReplacementForm(
      startTime: startTime,
      endTime: endTime,
      patientCount: _patientCountController.text.trim(),
      // Role isn't editable here (the update endpoint ignores it) — reuse
      // the existing one just to satisfy the shared validator.
      roleType: data.roleType,
      zipCodes: _zipCodes,
      cities: _cities,
      careTypeIds: _careTypeIds.toList(),
    );
    if (validationError != null) {
      _showSnack(validationError);
      return;
    }

    setState(() => _submitting = true);

    final payload = UpdateImmediateReplacementPayload(
      userId: data.userId,
      visibility: data.visibility,
      status: widget.isRepost ? 'open' : data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: startTime!,
      endTime: endTime!,
      patientCount: int.parse(_patientCountController.text.trim()),
      zipCodes: _zipCodes,
      cities: _cities,
      careTypeIds: _careTypeIds.toList(),
      country: data.country,
    );

    try {
      await ref
          .read(replacementCreateRepositoryProvider)
          .updateImmediateAgain(data.id, payload);
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
                          ? 'Republier le remplacement rapide'
                          : 'Modifier le remplacement rapide',
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
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
            children: [
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
