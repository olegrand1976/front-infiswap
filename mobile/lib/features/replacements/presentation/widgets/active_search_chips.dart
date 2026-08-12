import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/app_colors.dart';
import '../../data/replacements_list_notifier.dart';
import '../../models/replacement_search_params.dart';

class ActiveSearchChips extends ConsumerWidget {
  const ActiveSearchChips({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.watch(replacementsListProvider);
    final notifier = ref.read(replacementsListProvider.notifier);
    final params = notifier.params;

    if (!params.hasAnyActive) {
      return const SizedBox.shrink();
    }

    final chips = <_ActiveChipData>[];

    for (final zip in params.zipCodes) {
      chips.add(
        _ActiveChipData(
          label: zip,
          onDeleted: () => notifier.removeZipCode(zip),
        ),
      );
    }

    for (final city in params.cities) {
      chips.add(
        _ActiveChipData(
          label: city,
          onDeleted: () => notifier.removeCity(city),
        ),
      );
    }

    if (params.country != ReplacementSearchParams.defaultCountry) {
      chips.add(
        _ActiveChipData(
          label: replacementCountryLabels[params.country] ?? params.country,
          onDeleted: notifier.clearCountry,
        ),
      );
    }

    if (params.filterType != 'all') {
      chips.add(
        _ActiveChipData(
          label: replacementTypeLabels[params.filterType]!,
          onDeleted: notifier.clearFilterType,
        ),
      );
    }

    if (params.filterRole != 'all') {
      chips.add(
        _ActiveChipData(
          label: replacementRoleLabels[params.filterRole]!,
          onDeleted: notifier.clearFilterRole,
        ),
      );
    }

    for (final day in params.days) {
      chips.add(
        _ActiveChipData(
          label: replacementDayLabels[day] ?? day,
          onDeleted: () => notifier.removeDay(day),
        ),
      );
    }

    final colors = context.appColors;

    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: chips.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final chip = chips[index];
          return InputChip(
            label: Text(chip.label),
            deleteIconColor: colors.textSecondary,
            onDeleted: chip.onDeleted,
            backgroundColor: colors.primaryMuted,
            side: BorderSide(color: colors.primaryOutline),
            labelStyle: TextStyle(color: colors.primary, fontSize: 13),
          );
        },
      ),
    );
  }
}

class _ActiveChipData {
  const _ActiveChipData({required this.label, required this.onDeleted});

  final String label;
  final VoidCallback onDeleted;
}
