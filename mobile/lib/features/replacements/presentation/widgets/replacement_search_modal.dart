import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/location/location_repository.dart';
import '../../../../core/theme/app_colors.dart';
import 'section_label.dart';
import '../../../../core/theme/app_radii.dart';

class ReplacementSearchModal extends ConsumerStatefulWidget {
  const ReplacementSearchModal({
    super.key,
    required this.initialZipCodes,
    required this.initialCities,
    required this.onApply,
  });

  final List<String> initialZipCodes;
  final List<String> initialCities;
  final void Function({
    required List<String> zipCodes,
    required List<String> cities,
  }) onApply;

  static Future<void> show(
    BuildContext context, {
    required List<String> initialZipCodes,
    required List<String> initialCities,
    required void Function({
      required List<String> zipCodes,
      required List<String> cities,
    }) onApply,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ReplacementSearchModal(
        initialZipCodes: initialZipCodes,
        initialCities: initialCities,
        onApply: onApply,
      ),
    );
  }

  @override
  ConsumerState<ReplacementSearchModal> createState() =>
      _ReplacementSearchModalState();
}

class _ReplacementSearchModalState
    extends ConsumerState<ReplacementSearchModal> {
  late List<String> _zipCodes;
  late List<String> _cities;
  final _zipController = TextEditingController();
  final _cityController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _zipCodes = List<String>.from(widget.initialZipCodes);
    _cities = List<String>.from(widget.initialCities);
  }

  @override
  void dispose() {
    _zipController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _addZip() async {
    final value = _zipController.text.trim();
    if (value.isEmpty || !RegExp(r'^\d+$').hasMatch(value)) {
      return;
    }
    if (!_zipCodes.contains(value)) {
      setState(() => _zipCodes = [..._zipCodes, value]);
    }
    _zipController.clear();

    try {
      final matches = await ref
          .read(locationRepositoryProvider)
          .getCitiesFromZipCode(value);
      if (matches.isNotEmpty && mounted) {
        setState(() => _cities = {..._cities, ...matches}.toList());
      }
    } catch (_) {}
  }

  Future<void> _addCity() async {
    final value = _cityController.text.trim();
    if (value.isEmpty || RegExp(r'^\d+$').hasMatch(value)) {
      return;
    }
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

  void _reset() {
    setState(() {
      _zipCodes = [];
      _cities = [];
      _zipController.clear();
      _cityController.clear();
    });
  }

  void _apply() {
    widget.onApply(zipCodes: _zipCodes, cities: _cities);
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;

    return Padding(
      padding: EdgeInsets.only(bottom: bottomInset),
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.sizeOf(context).height * 0.85,
        ),
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius:
              const BorderRadius.vertical(top: Radius.circular(AppRadii.md)),
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: colors.divider,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Rechercher',
                        style: TextStyle(
                          color: colors.textPrimary,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: Icon(Icons.close, color: colors.textSecondary),
                    ),
                  ],
                ),
              ),
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SectionLabel(label: 'Codes postaux'),
                      const SizedBox(height: 8),
                      _TagInputRow(
                        controller: _zipController,
                        hint: 'Ex. 1000',
                        keyboardType: TextInputType.number,
                        onSubmit: _addZip,
                        onAdd: _addZip,
                      ),
                      if (_zipCodes.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        _TagWrap(
                          tags: _zipCodes,
                          onRemove: (tag) {
                            setState(
                              () => _zipCodes =
                                  _zipCodes.where((z) => z != tag).toList(),
                            );
                          },
                        ),
                      ],
                      const SizedBox(height: 20),
                      const SectionLabel(label: 'Villes'),
                      const SizedBox(height: 8),
                      _TagInputRow(
                        controller: _cityController,
                        hint: 'Ex. Bruxelles',
                        onSubmit: _addCity,
                        onAdd: _addCity,
                      ),
                      if (_cities.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        _TagWrap(
                          tags: _cities,
                          onRemove: (tag) {
                            setState(
                              () => _cities =
                                  _cities.where((c) => c != tag).toList(),
                            );
                          },
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _reset,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: colors.textPrimary,
                          side: BorderSide(color: colors.border),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        child: const Text('Réinitialiser'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _apply,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: colors.primary,
                          foregroundColor: colors.onPrimary,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                        child: const Text('Appliquer'),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TagInputRow extends StatelessWidget {
  const _TagInputRow({
    required this.controller,
    required this.hint,
    required this.onSubmit,
    required this.onAdd,
    this.keyboardType,
  });

  final TextEditingController controller;
  final String hint;
  final VoidCallback onSubmit;
  final VoidCallback onAdd;
  final TextInputType? keyboardType;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Row(
      children: [
        Expanded(
          // No local InputDecoration override — inherits fill/border/padding
          // from AppTheme.inputDecorationTheme, so it stays in sync with
          // every other input instead of drifting out of it.
          child: TextField(
            controller: controller,
            keyboardType: keyboardType,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => onSubmit(),
            decoration: InputDecoration(hintText: hint),
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
    );
  }
}

class _TagWrap extends StatelessWidget {
  const _TagWrap({required this.tags, required this.onRemove});

  final List<String> tags;
  final void Function(String tag) onRemove;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Wrap(
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
    );
  }
}
