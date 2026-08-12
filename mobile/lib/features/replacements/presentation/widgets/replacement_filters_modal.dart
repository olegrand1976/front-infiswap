import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../models/replacement_search_params.dart';
import 'section_label.dart';
import '../../../../core/theme/app_radii.dart';

class ReplacementFiltersModal extends StatefulWidget {
  const ReplacementFiltersModal({
    super.key,
    required this.initialCountry,
    required this.initialFilterType,
    required this.initialFilterRole,
    required this.initialDays,
    required this.onApply,
  });

  final String initialCountry;
  final String initialFilterType;
  final String initialFilterRole;
  final List<String> initialDays;
  final void Function({
    required String country,
    required String filterType,
    required String filterRole,
    required List<String> days,
  }) onApply;

  static Future<void> show(
    BuildContext context, {
    required String initialCountry,
    required String initialFilterType,
    required String initialFilterRole,
    required List<String> initialDays,
    required void Function({
      required String country,
      required String filterType,
      required String filterRole,
      required List<String> days,
    }) onApply,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ReplacementFiltersModal(
        initialCountry: initialCountry,
        initialFilterType: initialFilterType,
        initialFilterRole: initialFilterRole,
        initialDays: initialDays,
        onApply: onApply,
      ),
    );
  }

  @override
  State<ReplacementFiltersModal> createState() =>
      _ReplacementFiltersModalState();
}

class _ReplacementFiltersModalState extends State<ReplacementFiltersModal> {
  late String _country;
  late String _filterType;
  late String _filterRole;
  late List<String> _days;

  @override
  void initState() {
    super.initState();
    _country = widget.initialCountry;
    _filterType = widget.initialFilterType;
    _filterRole = widget.initialFilterRole;
    _days = List<String>.from(widget.initialDays);
  }

  void _toggleDay(String day) {
    setState(() {
      if (_days.contains(day)) {
        _days = _days.where((d) => d != day).toList();
      } else {
        _days = [..._days, day];
      }
    });
  }

  void _reset() {
    setState(() {
      _country = ReplacementSearchParams.defaultCountry;
      _filterType = 'all';
      _filterRole = 'all';
      _days = [];
    });
  }

  void _apply() {
    widget.onApply(
      country: _country,
      filterType: _filterType,
      filterRole: _filterRole,
      days: _days,
    );
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
          borderRadius: const BorderRadius.vertical(top: Radius.circular(AppRadii.md)),
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
                        'Filtres',
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
                      const SectionLabel(label: 'Pays'),
                      const SizedBox(height: 10),
                      _OptionChips(
                        options: replacementCountryLabels,
                        selected: _country,
                        onSelected: (value) =>
                            setState(() => _country = value),
                      ),
                      const SizedBox(height: 20),
                      const SectionLabel(label: 'Type'),
                      const SizedBox(height: 10),
                      _OptionChips(
                        options: replacementTypeLabels,
                        selected: _filterType,
                        onSelected: (value) =>
                            setState(() => _filterType = value),
                      ),
                      const SizedBox(height: 20),
                      const SectionLabel(label: 'Rôle'),
                      const SizedBox(height: 10),
                      _OptionChips(
                        options: replacementRoleLabels,
                        selected: _filterRole,
                        onSelected: (value) =>
                            setState(() => _filterRole = value),
                      ),
                      const SizedBox(height: 20),
                      const SectionLabel(label: 'Jours'),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          for (final day in replacementWeekDays)
                            FilterChip(
                              label: Text(replacementDayLabels[day]!),
                              selected: _days.contains(day),
                              onSelected: (_) => _toggleDay(day),
                              selectedColor: colors.primaryMuted,
                              checkmarkColor: colors.primary,
                              side: BorderSide(
                                color: _days.contains(day)
                                    ? colors.primaryOutline
                                    : colors.border,
                              ),
                              labelStyle: TextStyle(
                                color: _days.contains(day)
                                    ? colors.primary
                                    : colors.textPrimary,
                              ),
                            ),
                        ],
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

class _OptionChips extends StatelessWidget {
  const _OptionChips({
    required this.options,
    required this.selected,
    required this.onSelected,
  });

  final Map<String, String> options;
  final String selected;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        for (final entry in options.entries)
          ChoiceChip(
            label: Text(entry.value),
            selected: selected == entry.key,
            onSelected: (_) => onSelected(entry.key),
            selectedColor: colors.primaryMuted,
            side: BorderSide(
              color: selected == entry.key
                  ? colors.primaryOutline
                  : colors.border,
            ),
            labelStyle: TextStyle(
              color: selected == entry.key
                  ? colors.primary
                  : colors.textPrimary,
            ),
          ),
      ],
    );
  }
}
