import 'package:flutter/material.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/location/location_repository.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/settings_repository.dart';
import '../../models/settings_models.dart';
import 'settings_sheet_scaffold.dart';

class ZonePreferencesCard extends StatefulWidget {
  const ZonePreferencesCard({
    super.key,
    required this.repository,
    required this.locationRepository,
    required this.initial,
  });

  final SettingsRepository repository;
  final LocationRepository locationRepository;
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
      final nextCities = [..._cities, value];
      var nextZipCodes = _zipCodes;
      try {
        final matches = await widget.locationRepository.getZipCodesFromCity(value);
        if (matches.isNotEmpty) {
          nextZipCodes = {..._zipCodes, ...matches}.toList();
        }
      } catch (_) {}

      await widget.repository
          .addZonePreferences(cities: nextCities, zipCodes: nextZipCodes);
      setState(() {
        _cities = nextCities;
        _zipCodes = nextZipCodes;
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
      final nextZipCodes = [..._zipCodes, value];
      var nextCities = _cities;
      try {
        final matches = await widget.locationRepository.getCitiesFromZipCode(value);
        if (matches.isNotEmpty) {
          nextCities = {..._cities, ...matches}.toList();
        }
      } catch (_) {}

      await widget.repository
          .addZonePreferences(cities: nextCities, zipCodes: nextZipCodes);
      setState(() {
        _zipCodes = nextZipCodes;
        _cities = nextCities;
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
                minimumSize: const Size(40, 40),
                padding: EdgeInsets.zero,
              ),
              icon: const Icon(Icons.add, size: 18),
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
                minimumSize: const Size(40, 40),
                padding: EdgeInsets.zero,
              ),
              icon: const Icon(Icons.add, size: 18),
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
