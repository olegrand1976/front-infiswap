import 'package:flutter/material.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/settings_repository.dart';
import '../../models/settings_models.dart';
import 'settings_sheet_scaffold.dart';

/// Zone matching preferences (zip codes / cities used to notify the nurse of
/// nearby replacements). The API only ever merges new values in — there is no
/// endpoint to remove one — so this editor is add-only, matching what the
/// backend actually supports.
class ZonePreferencesCard extends StatefulWidget {
  const ZonePreferencesCard({
    super.key,
    required this.repository,
    required this.initial,
  });

  final SettingsRepository repository;
  final ReplacementZonePreferences initial;

  @override
  State<ZonePreferencesCard> createState() => _ZonePreferencesCardState();
}

class _ZonePreferencesCardState extends State<ZonePreferencesCard> {
  late List<String> _cities;
  late List<String> _zipCodes;
  final _cityController = TextEditingController();
  final _zipController = TextEditingController();
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _cities = [...widget.initial.cities];
    _zipCodes = [...widget.initial.zipCodes];
  }

  @override
  void dispose() {
    _cityController.dispose();
    _zipController.dispose();
    super.dispose();
  }

  Future<void> _addCity() async {
    final value = _cityController.text.trim();
    if (value.isEmpty || _cities.contains(value)) return;

    setState(() => _isSaving = true);
    try {
      final next = [..._cities, value];
      await widget.repository.addZonePreferences(cities: next, zipCodes: _zipCodes);
      setState(() {
        _cities = next;
        _cityController.clear();
      });
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  Future<void> _addZipCode() async {
    final value = _zipController.text.trim();
    if (value.isEmpty || _zipCodes.contains(value)) return;

    setState(() => _isSaving = true);
    try {
      final next = [..._zipCodes, value];
      await widget.repository.addZonePreferences(cities: _cities, zipCodes: next);
      setState(() {
        _zipCodes = next;
        _zipController.clear();
      });
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _cityController,
                textInputAction: TextInputAction.done,
                onSubmitted: (_) => _addCity(),
                decoration: const InputDecoration(
                  labelText: 'Ville',
                  prefixIcon: Icon(Icons.location_city_outlined),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: _isSaving ? null : _addCity,
              style: IconButton.styleFrom(
                backgroundColor: colors.primary,
                foregroundColor: colors.onPrimary,
              ),
              icon: const Icon(Icons.add),
            ),
          ],
        ),
        if (_cities.isNotEmpty) ...[
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [for (final city in _cities) Chip(label: Text(city))],
          ),
        ],
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _zipController,
                keyboardType: TextInputType.number,
                textInputAction: TextInputAction.done,
                onSubmitted: (_) => _addZipCode(),
                decoration: const InputDecoration(
                  labelText: 'Code postal',
                  prefixIcon: Icon(Icons.pin_drop_outlined),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: _isSaving ? null : _addZipCode,
              style: IconButton.styleFrom(
                backgroundColor: colors.primary,
                foregroundColor: colors.onPrimary,
              ),
              icon: const Icon(Icons.add),
            ),
          ],
        ),
        if (_zipCodes.isNotEmpty) ...[
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [for (final zip in _zipCodes) Chip(label: Text(zip))],
          ),
        ],
      ],
    );
  }
}
