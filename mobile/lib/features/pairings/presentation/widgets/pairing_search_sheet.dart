import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';

class PairingSearchSheet extends StatefulWidget {
  const PairingSearchSheet({
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
      builder: (_) => PairingSearchSheet(
        initialZipCodes: initialZipCodes,
        initialCities: initialCities,
        onApply: onApply,
      ),
    );
  }

  @override
  State<PairingSearchSheet> createState() => _PairingSearchSheetState();
}

class _PairingSearchSheetState extends State<PairingSearchSheet> {
  late List<String> _zipCodes = List.of(widget.initialZipCodes);
  late List<String> _cities = List.of(widget.initialCities);
  final _zipController = TextEditingController();
  final _cityController = TextEditingController();

  @override
  void dispose() {
    _zipController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  void _addZip() {
    final value = _zipController.text.trim();
    if (value.isEmpty || _zipCodes.contains(value)) return;
    setState(() => _zipCodes = [..._zipCodes, value]);
    _zipController.clear();
  }

  void _addCity() {
    final value = _cityController.text.trim();
    if (value.isEmpty || _cities.contains(value)) return;
    setState(() => _cities = [..._cities, value]);
    _cityController.clear();
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
        constraints:
            BoxConstraints(maxHeight: MediaQuery.sizeOf(context).height * 0.85),
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
                        'Rechercher un binôme',
                        style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.w600),
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
                      _Section(
                        label: 'Codes postaux',
                        controller: _zipController,
                        hint: 'Ex. 1000',
                        keyboardType: TextInputType.number,
                        onAdd: _addZip,
                        tags: _zipCodes,
                        onRemove: (tag) => setState(() => _zipCodes =
                            _zipCodes.where((z) => z != tag).toList()),
                      ),
                      const SizedBox(height: 20),
                      _Section(
                        label: 'Villes',
                        controller: _cityController,
                        hint: 'Ex. Bruxelles',
                        onAdd: _addCity,
                        tags: _cities,
                        onRemove: (tag) => setState(() =>
                            _cities = _cities.where((c) => c != tag).toList()),
                      ),
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
                            side: BorderSide(color: colors.border)),
                        child: const Text('Réinitialiser'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _apply,
                        style: ElevatedButton.styleFrom(
                            backgroundColor: colors.primary,
                            foregroundColor: colors.onPrimary),
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

class _Section extends StatelessWidget {
  const _Section({
    required this.label,
    required this.controller,
    required this.hint,
    required this.onAdd,
    required this.tags,
    required this.onRemove,
    this.keyboardType,
  });

  final String label;
  final TextEditingController controller;
  final String hint;
  final VoidCallback onAdd;
  final List<String> tags;
  final void Function(String tag) onRemove;
  final TextInputType? keyboardType;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
              color: colors.textSecondary,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: .4),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                keyboardType: keyboardType,
                textInputAction: TextInputAction.done,
                onSubmitted: (_) => onAdd(),
                decoration: InputDecoration(hintText: hint),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: onAdd,
              style: IconButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: colors.onPrimary),
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
